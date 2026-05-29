import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  AnalyticsContextDashboardMetrics,
  AnalyticsContextFacade,
} from '../../interfaces/acl/analytics-context-facade';
import { AnalyticsQueryServiceImpl } from '../internal/queryservices/analytics-query-service.impl';
import { createGetDashboardMetricsQuery } from '../../domain/model/queries/get-dashboard-metrics.query';
import { AnalyticsOverviewQueryServiceImpl } from '../internal/queryservices/analytics-overview-query-service.impl';
import { createGetAnalyticsOverviewQuery } from '../../domain/model/queries/get-analytics-overview.query';
import { AnalyticsOverviewSnapshot } from '../../domain/model/valueobjects/analytics-overview.value-object';

@Injectable({ providedIn: 'root' })
export class AnalyticsContextFacadeImpl implements AnalyticsContextFacade {
  constructor(
    private readonly analyticsQueryService: AnalyticsQueryServiceImpl,
    private readonly analyticsOverviewQueryService: AnalyticsOverviewQueryServiceImpl,
  ) {}

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

  getOverviewDashboard(
    deviceLimitPerSpace?: number,
    alertLimit?: number,
  ): Observable<AnalyticsOverviewSnapshot> {
    const query = createGetAnalyticsOverviewQuery(deviceLimitPerSpace, alertLimit);
    return this.analyticsOverviewQueryService.handleGetAnalyticsOverview(query);
  }
}
