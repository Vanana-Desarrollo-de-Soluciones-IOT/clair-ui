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
        const orgId = orgs?.[0]?.id;
        if (!orgId) return of(null);
        return this.deviceContextFacade.getSpacesByOrganization(orgId);
      }),
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
          telemetry: this.evaluationContextFacade.getLatestTelemetryByDevice(deviceId),
          metrics: this.analyticsQueryService.handleGetDashboardMetrics(query),
        });
      }),
      map((result): OverviewMeasurements | null => {
        if (!result) return null;

        const telemetry = result.telemetry;
        const metrics = result.metrics;

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
      catchError((error) => {
        console.error('Error in Overview ACL:', error);
        return of(null);
      }),
    );
  }
}
