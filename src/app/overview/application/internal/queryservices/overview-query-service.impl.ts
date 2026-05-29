import { Injectable, Inject } from '@angular/core';
import { Observable, catchError, forkJoin, map, of, switchMap } from 'rxjs';
import {
  DEVICE_CONTEXT_FACADE,
  DeviceContextFacade,
} from '../../../../device/interfaces/acl/device-context-facade';
import {
  EVALUATION_CONTEXT_FACADE,
  EvaluationContextFacade,
} from '../../../../evaluation/interfaces/acl/evaluation-context-facade';
import {
  ANALYTICS_CONTEXT_FACADE,
  AnalyticsContextFacade,
} from '../../../../analytics/interfaces/acl/analytics-context-facade';
import {
  ALERTING_CONTEXT_FACADE,
  AlertingContextFacade,
} from '../../../../alerting/interfaces/acl/alerting-context-facade';
import { AlertStatus_ACTIVE, AlertStatus_ACKNOWLEDGED } from '../../../../alerting/domain/model/valueobjects/alert-status.value-object';
import { GetLatestOverviewMeasurementsQuery } from '../../../domain/model/queries/get-latest-overview-measurements.query';
import { OverviewQueryService } from '../../../domain/services/overview-query-service';
import {
  OverviewAlertItem,
  OverviewMeasurements,
  OverviewOrganizationAqi,
} from '../../../interfaces/acl/overview-context-facade';

@Injectable({ providedIn: 'root' })
export class OverviewQueryServiceImpl implements OverviewQueryService {
  constructor(
    @Inject(DEVICE_CONTEXT_FACADE)
    private readonly deviceContextFacade: DeviceContextFacade,
    @Inject(EVALUATION_CONTEXT_FACADE)
    private readonly evaluationContextFacade: EvaluationContextFacade,
    @Inject(ANALYTICS_CONTEXT_FACADE)
    private readonly analyticsContextFacade: AnalyticsContextFacade,
    @Inject(ALERTING_CONTEXT_FACADE)
    private readonly alertingContextFacade: AlertingContextFacade,
  ) {}

  handleGetLatestOverviewMeasurements(
    _query: GetLatestOverviewMeasurementsQuery,
  ): Observable<OverviewMeasurements | null> {
    return this.deviceContextFacade.getOrganizations().pipe(
      switchMap((orgs) => {
        const hasOrganizations = !!orgs?.length;
        return forkJoin({
          core: hasOrganizations ? this.loadCoreMeasurements(orgs) : of(null),
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
        console.error('Error in Overview query service:', error);
        return of(null);
      }),
    );
  }

  private loadCoreMeasurements(
    orgs: Array<{ id: string; name: string }>,
  ): Observable<Omit<OverviewMeasurements, 'organizations' | 'alerts'> | null> {
    const spaceRequests = orgs.map((org) =>
      this.deviceContextFacade.getSpacesByOrganization(org.id).pipe(catchError(() => of([]))),
    );

    return (spaceRequests.length ? forkJoin(spaceRequests) : of([])).pipe(
      map((spaceGroups) => spaceGroups.flat()),
      switchMap((spaces) => {
        if (!spaces.length) return of<string[]>([]);
        const deviceRequests = spaces.map((space) =>
          this.deviceContextFacade.getDevicesBySpace(space.id).pipe(catchError(() => of([]))),
        );
        return (deviceRequests.length ? forkJoin(deviceRequests) : of([])).pipe(
          map((deviceGroups) =>
            Array.from(new Set(deviceGroups.flat().map((device) => device.id))).filter(Boolean),
          ),
        );
      }),
      switchMap((deviceIds) => {
        if (!deviceIds.length) return of(null);
        const requests = deviceIds.map((deviceId) =>
          forkJoin({
            telemetry: this.evaluationContextFacade
              .getLatestTelemetryByDevice(deviceId)
              .pipe(catchError(() => of(null))),
            metrics: this.analyticsContextFacade
              .getLiveDashboardMetricsByDevice(deviceId)
              .pipe(catchError(() => of(null))),
          }),
        );
        return forkJoin(requests).pipe(map((results) => this.aggregateCoreMeasurements(results)));
      }),
    );
  }

  private aggregateCoreMeasurements(
    results: Array<{
      telemetry: {
        co2: number | null;
        pm2_5: number | null;
        temperature: number | null;
        humidity: number | null;
        recordedAt: string;
      } | null;
      metrics: {
        aqiValue: number;
        aqiCategory: string;
        co2Value: number;
        pm2_5Value: number;
        temperatureValue: number;
        humidityValue: number;
        calculatedAt: string;
      } | null;
    }>,
  ): Omit<OverviewMeasurements, 'organizations' | 'alerts'> | null {
    const aqiValues = results
      .map((result) => result.metrics?.aqiValue)
      .filter((value): value is number => Number.isFinite(value));

    const co2Values = results
      .map((result) => result.telemetry?.co2 ?? result.metrics?.co2Value ?? null)
      .filter((value): value is number => Number.isFinite(value));

    const pm2_5Values = results
      .map((result) => result.telemetry?.pm2_5 ?? result.metrics?.pm2_5Value ?? null)
      .filter((value): value is number => Number.isFinite(value));

    const temperatureValues = results
      .map((result) => result.telemetry?.temperature ?? result.metrics?.temperatureValue ?? null)
      .filter((value): value is number => Number.isFinite(value));

    const humidityValues = results
      .map((result) => result.telemetry?.humidity ?? result.metrics?.humidityValue ?? null)
      .filter((value): value is number => Number.isFinite(value));

    const recordedAt =
      results
        .map((result) => result.telemetry?.recordedAt ?? null)
        .filter((value): value is string => !!value)
        .sort((a, b) => Date.parse(b) - Date.parse(a))[0] ?? null;

    const averageAqi = this.average(aqiValues);
    const averageCo2 = this.average(co2Values);
    const averagePm2_5 = this.average(pm2_5Values);
    const averageTemperature = this.average(temperatureValues);
    const averageHumidity = this.average(humidityValues);

    if (
      averageAqi === null &&
      averageCo2 === null &&
      averagePm2_5 === null &&
      averageTemperature === null &&
      averageHumidity === null
    ) {
      return null;
    }

    return {
      aqi:
        averageAqi === null
          ? null
          : {
              value: Math.round(averageAqi),
              category: this.resolveAqiCategory(averageAqi),
            },
      co2: averageCo2,
      pm2_5: averagePm2_5,
      temperature: averageTemperature,
      humidity: averageHumidity,
      recordedAt,
    };
  }

  private average(values: number[]): number | null {
    if (!values.length) return null;
    const total = values.reduce((acc, current) => acc + current, 0);
    return Math.round((total / values.length) * 10) / 10;
  }

  private resolveAqiCategory(aqiValue: number): string {
    if (aqiValue <= 50) return 'GOOD';
    if (aqiValue <= 100) return 'MODERATE';
    if (aqiValue <= 150) return 'UNHEALTHY_FOR_SENSITIVE_GROUPS';
    if (aqiValue <= 200) return 'UNHEALTHY';
    if (aqiValue <= 300) return 'VERY_UNHEALTHY';
    return 'HAZARDOUS';
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
                    aqiCategory: null,
                  });
                }
                return this.analyticsContextFacade.getLiveDashboardMetricsByDevice(deviceId).pipe(
                  map((metrics) => ({
                    organizationName: org.name,
                    spaceName: space.name,
                    aqiValue: metrics?.aqiValue ?? null,
                    aqiCategory: metrics?.aqiCategory ?? null,
                  })),
                  catchError(() =>
                    of({
                      organizationName: org.name,
                      spaceName: space.name,
                      aqiValue: null,
                      aqiCategory: null,
                    }),
                  ),
                );
              }),
              catchError(() =>
                of({
                  organizationName: org.name,
                  spaceName: space.name,
                  aqiValue: null,
                  aqiCategory: null,
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
    return this.alertingContextFacade
      .getCurrentUserAlerts(0, 5, [AlertStatus_ACTIVE, AlertStatus_ACKNOWLEDGED])
      .pipe(
        map((alerts) =>
          alerts.map((alert) => ({
            id: alert.id,
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
