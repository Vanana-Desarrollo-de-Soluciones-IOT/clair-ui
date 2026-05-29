import { Injectable, Inject } from '@angular/core';
import { Observable, catchError, map, of, switchMap, forkJoin } from 'rxjs';
import {
  DEVICE_CONTEXT_FACADE,
  DeviceContextFacade,
} from '../../../../device/interfaces/acl/device-context-facade';
import {
  EVALUATION_CONTEXT_FACADE,
  EvaluationContextFacade,
} from '../../../../evaluation/interfaces/acl/evaluation-context-facade';
import { AnalyticsQueryServiceImpl } from '../../../../analytics/application/internal/queryservices/analytics-query-service.impl';
import { createGetDashboardMetricsQuery } from '../../../../analytics/domain/model/queries/get-dashboard-metrics.query';
import {
  AlertQueryServiceImpl,
} from '../../../../alerting/application/internal/queryservices/alert-query-service.impl';
import { createGetAlertsByDeviceQuery } from '../../../../alerting/domain/model/queries/get-alerts-by-device.query';
import { AlertStatus_ACTIVE, AlertStatus_ACKNOWLEDGED } from '../../../../alerting/domain/model/valueobjects/alert-status.value-object';
import { SpaceDevicesNavigationStateService } from '../../../../device/interfaces/pages/space-devices-page/space-devices-navigation-state.service';
import {
  OverviewContextFacade,
  OverviewMeasurements,
  OverviewOrganizationAqi,
  OverviewAlertItem,
} from '../../../interfaces/acl/overview-context-facade';

@Injectable({ providedIn: 'root' })
export class OverviewContextFacadeImpl implements OverviewContextFacade {
  constructor(
    @Inject(DEVICE_CONTEXT_FACADE)
    private readonly deviceContextFacade: DeviceContextFacade,
    @Inject(EVALUATION_CONTEXT_FACADE)
    private readonly evaluationContextFacade: EvaluationContextFacade,
    private readonly analyticsQueryService: AnalyticsQueryServiceImpl,
    private readonly alertQueryService: AlertQueryServiceImpl,
    private readonly navigationState: SpaceDevicesNavigationStateService,
  ) {}

  getLatestOverviewMeasurements(): Observable<OverviewMeasurements | null> {
    return this.deviceContextFacade.getOrganizations().pipe(
      switchMap((orgs) => {
        const hasOrganizations = !!orgs?.length;
        const primaryOrgId = hasOrganizations ? orgs[0].id : null;
        return forkJoin({
          core: primaryOrgId ? this.loadCoreMeasurements(primaryOrgId) : of(null),
          organizations: hasOrganizations ? this.loadOrganizationsAqi(orgs) : of([]),
          alerts: this.loadActiveDeviceAlerts(),
        });
      }),
      map((result): OverviewMeasurements | null => {
        if (!result) return null;
        const core = result.core;
        const organizations = result.organizations ?? [];
        const alerts = result.alerts ?? [];

        if (!core) {
          return {
            aqi: null,
            co2: null,
            temperature: null,
            humidity: null,
            pm2_5: null,
            recordedAt: null,
            organizations,
            alerts,
          };
        }

        return {
          ...core,
          organizations,
          alerts,
        };
      }),
      catchError((error) => {
        console.error('Error in Overview ACL:', error);
        return of(null);
      }),
    );
  }

  private loadCoreMeasurements(
    orgId: string,
  ): Observable<Omit<OverviewMeasurements, 'organizations' | 'alerts'> | null> {
    return this.deviceContextFacade.getSpacesByOrganization(orgId).pipe(
      switchMap((spaces) => {
        const spaceId = spaces?.[0]?.id;
        if (!spaceId) return of(null);
        return this.deviceContextFacade.getDevicesBySpace(spaceId);
      }),
      switchMap((devices) => {
        const deviceId = devices?.[0]?.id;
        if (!deviceId) return of(null);
        const query = createGetDashboardMetricsQuery(deviceId, 'LIVE');
        return forkJoin({
          telemetry: this.evaluationContextFacade
            .getLatestTelemetryByDevice(deviceId)
            .pipe(catchError(() => of(null))),
          metrics: this.analyticsQueryService
            .handleGetDashboardMetrics(query)
            .pipe(catchError(() => of(null))),
        });
      }),
      map((result) => {
        if (!result) return null;
        const telemetry = result.telemetry;
        const metrics = result.metrics;
        if (!telemetry && !metrics) return null;

        return {
          aqi: metrics
            ? {
                value: metrics.aqi.value,
                category: metrics.aqi.category,
              }
            : null,
          co2: telemetry?.co2 ?? null,
          pm2_5: telemetry?.pm2_5 ?? null,
          temperature: telemetry?.temperature ?? null,
          humidity: telemetry?.humidity ?? null,
          recordedAt: telemetry?.recordedAt ?? null,
        };
      }),
    );
  }

  private loadOrganizationsAqi(
    orgs: Array<{ id: string; name: string }>,
  ): Observable<OverviewOrganizationAqi[]> {
    const orgRequests = orgs.map((org) =>
      this.deviceContextFacade.getSpacesByOrganization(org.id).pipe(
        switchMap((spaces) => {
          if (!spaces?.length) return of<OverviewOrganizationAqi[]>([]);
          const spaceRequests = spaces.map((space) =>
            this.deviceContextFacade.getDevicesBySpace(space.id).pipe(
              switchMap((devices) => {
                const deviceId = devices?.[0]?.id;
                if (!deviceId) {
                  return of({
                    organizationName: org.name,
                    spaceName: space.name,
                    aqiValue: null,
                  });
                }
                const query = createGetDashboardMetricsQuery(deviceId, 'LIVE');
                return this.analyticsQueryService.handleGetDashboardMetrics(query).pipe(
                  map((metrics) => ({
                    organizationName: org.name,
                    spaceName: space.name,
                    aqiValue: metrics?.aqi?.value ?? null,
                  })),
                  catchError(() =>
                    of({
                      organizationName: org.name,
                      spaceName: space.name,
                      aqiValue: null,
                    }),
                  ),
                );
              }),
              catchError(() =>
                of({
                  organizationName: org.name,
                  spaceName: space.name,
                  aqiValue: null,
                }),
              ),
            ),
          );
          return spaceRequests.length ? forkJoin(spaceRequests) : of([]);
        }),
        map((spaceResults) => spaceResults.flat()),
        catchError(() => of([])),
      ),
    );

    return orgRequests.length
      ? forkJoin(orgRequests).pipe(map((orgResults) => orgResults.flat()))
      : of([]);
  }

  private loadActiveDeviceAlerts(): Observable<OverviewAlertItem[]> {
    const selection = this.navigationState.readSelectionFromLocalStorage();
    const deviceId = selection?.deviceId ?? null;
    if (!deviceId) return of([]);

    const query = createGetAlertsByDeviceQuery(deviceId, 0, 5);
    return this.alertQueryService
      .handleGetAlertsByDevice(query, [AlertStatus_ACTIVE, AlertStatus_ACKNOWLEDGED])
      .pipe(
        map((page) =>
          page.content.map((alert) => ({
            id: alert.id.value,
            message: alert.message,
            severity: alert.severity,
            status: alert.status,
            deviceName: alert.deviceName,
            spaceName: alert.spaceName,
            occurredAt: alert.occurredAt,
          })),
        ),
        catchError(() => of([])),
      );
  }
}
