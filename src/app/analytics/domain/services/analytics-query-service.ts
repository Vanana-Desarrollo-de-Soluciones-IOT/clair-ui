import { Observable } from 'rxjs';
import { GetDashboardMetricsQuery } from '../model/queries/get-dashboard-metrics.query';
import { GetTrendsQuery } from '../model/queries/get-trends.query';
import { Aqi } from '../model/valueobjects/aqi.value-object';
import { MetricDelta } from '../model/valueobjects/metric-delta.value-object';
import { TrendPoint } from '../model/valueobjects/trend-point.value-object';

export type DashboardMetrics = Readonly<{
  aqi: Aqi;
  co2: MetricDelta;
  pm2_5: MetricDelta;
  temperature: MetricDelta;
  humidity: MetricDelta;
  calculatedAt: string;
}>;

export interface AnalyticsQueryService {
  handleGetDashboardMetrics(query: GetDashboardMetricsQuery): Observable<DashboardMetrics>;
  handleGetTrends(query: GetTrendsQuery): Observable<TrendPoint[]>;
}
