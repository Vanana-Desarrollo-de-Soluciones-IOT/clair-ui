import { Observable } from 'rxjs';
import { DashboardMetricsResource } from '../../../interfaces/rest/resources/dashboard-metrics.resource';
import { TrendsResource } from '../../../interfaces/rest/resources/trends.resource';
import { AnalyticsOverviewResource } from '../../../interfaces/rest/resources/analytics-overview.resource';
import { LiveTelemetry } from '../../../domain/services/analytics-query-service';

export interface AnalyticsGateway {
  getDashboardMetrics(
    deviceId: string,
    period?: string,
    startDate?: string,
    endDate?: string,
  ): Observable<DashboardMetricsResource>;

  getTrends(
    deviceId: string,
    period?: string,
    startDate?: string,
    endDate?: string,
  ): Observable<TrendsResource>;

  getOverview(
    deviceLimitPerSpace?: number,
    alertLimit?: number,
  ): Observable<AnalyticsOverviewResource>;

  streamLiveTelemetry(deviceId: string): Observable<LiveTelemetry>;
}
