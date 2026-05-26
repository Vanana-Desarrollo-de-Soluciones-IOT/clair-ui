import { Observable } from 'rxjs';
import { DashboardMetricsResource } from '../../../interfaces/rest/resources/dashboard-metrics.resource';
import { TrendsResource } from '../../../interfaces/rest/resources/trends.resource';

export interface AnalyticsGateway {
  getDashboardMetrics(
    deviceId: string,
    period?: string,
    startDate?: string,
    endDate?: string
  ): Observable<DashboardMetricsResource>;

  getTrends(
    deviceId: string,
    period?: string,
    startDate?: string,
    endDate?: string
  ): Observable<TrendsResource>;
}
