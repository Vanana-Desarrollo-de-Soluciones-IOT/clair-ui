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
  OverviewContextFacade,
  OverviewMeasurements,
  OverviewOrganizationAqi,
} from '../../../interfaces/acl/overview-context-facade';

@Injectable({ providedIn: 'root' })
export class OverviewContextFacadeImpl implements OverviewContextFacade {
  constructor(
    @Inject(DEVICE_CONTEXT_FACADE)
    private readonly deviceContextFacade: DeviceContextFacade,
    @Inject(EVALUATION_CONTEXT_FACADE)
    private readonly evaluationContextFacade: EvaluationContextFacade,
    private readonly analyticsQueryService: AnalyticsQueryServiceImpl,
  ) {}

  getLatestOverviewMeasurements(): Observable<OverviewMeasurements | null> {
    return this.deviceContextFacade.getOrganizations().pipe(
      switchMap((orgs) => {
        if (!orgs?.length) return of(null);
        const primaryOrgId = orgs[0].id;
        return forkJoin({
          core: this.loadCoreMeasurements(primaryOrgId),
          organizations: this.loadOrganizationsAqi(orgs),
        });
      }),
      map((result): OverviewMeasurements | null => {
        if (!result) return null;
        const core = result.core;
        const organizations = result.organizations ?? [];

        if (!core) {
          return {
            aqi: null,
            co2: null,
            temperature: null,
            humidity: null,
            pm2_5: null,
            recordedAt: null,
            organizations,
          };
        }

        return {
          ...core,
          organizations,
        };
      }),
      catchError((error) => {
        console.error('Error in Overview ACL:', error);
        return of(null);
      }),
    );
  }

  private loadCoreMeasurements(orgId: string): Observable<Omit<OverviewMeasurements, 'organizations'> | null> {
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
}
