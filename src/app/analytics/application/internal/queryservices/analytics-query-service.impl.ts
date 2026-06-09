import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AnalyticsQueryService, DashboardMetrics, LiveTelemetry } from '../../../domain/services/analytics-query-service';
import { GetDashboardMetricsQuery } from '../../../domain/model/queries/get-dashboard-metrics.query';
import { GetTrendsQuery } from '../../../domain/model/queries/get-trends.query';
import { TrendPoint } from '../../../domain/model/valueobjects/trend-point.value-object';
import { AnalyticsHttpGateway } from '../../../infrastructure/api/gateways/analytics-http.gateway';
import { dashboardMetricsResourceToDomain, trendDataPointResourceToDomain } from '../../../interfaces/rest/transform/analytics.transform';

@Injectable({ providedIn: 'root' })
export class AnalyticsQueryServiceImpl implements AnalyticsQueryService {
  constructor(private readonly gateway: AnalyticsHttpGateway) {}

  handleGetDashboardMetrics(query: GetDashboardMetricsQuery): Observable<DashboardMetrics> {
    return this.gateway.getDashboardMetrics(query.deviceId, query.period, query.startDate, query.endDate).pipe(
      map(dashboardMetricsResourceToDomain)
    );
  }

  handleGetTrends(query: GetTrendsQuery): Observable<TrendPoint[]> {
    return this.gateway.getTrends(query.deviceId, query.period, query.startDate, query.endDate).pipe(
      map((resource) => resource.dataPoints.map(trendDataPointResourceToDomain))
    );
  }

  handleStreamLiveTelemetry(deviceId: string): Observable<LiveTelemetry> {
    return this.gateway.streamLiveTelemetry(deviceId);
  }
}
