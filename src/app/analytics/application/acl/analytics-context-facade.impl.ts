import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  AnalyticsContextDashboardMetrics,
  AnalyticsContextFacade,
} from '../../interfaces/acl/analytics-context-facade';
import { AnalyticsQueryServiceImpl } from '../internal/queryservices/analytics-query-service.impl';
import { createGetDashboardMetricsQuery } from '../../domain/model/queries/get-dashboard-metrics.query';

@Injectable({ providedIn: 'root' })
export class AnalyticsContextFacadeImpl implements AnalyticsContextFacade {
  constructor(private readonly analyticsQueryService: AnalyticsQueryServiceImpl) {}

  getLiveDashboardMetricsByDevice(
    deviceId: string,
  ): Observable<AnalyticsContextDashboardMetrics> {
    const query = createGetDashboardMetricsQuery(deviceId, 'LIVE');
    return this.analyticsQueryService.handleGetDashboardMetrics(query).pipe(
      map((metrics) => ({
        aqiValue: metrics.aqi.value,
        aqiCategory: metrics.aqi.category,
        co2Value: metrics.co2.value,
        pm2_5Value: metrics.pm2_5.value,
        temperatureValue: metrics.temperature.value,
        humidityValue: metrics.humidity.value,
        calculatedAt: metrics.calculatedAt,
      })),
    );
  }
}
