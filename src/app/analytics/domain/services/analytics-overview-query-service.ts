import { Observable } from 'rxjs';
import { GetAnalyticsOverviewQuery } from '../model/queries/get-analytics-overview.query';
import { AnalyticsOverviewSnapshot } from '../model/valueobjects/analytics-overview.value-object';

export interface AnalyticsOverviewQueryService {
  handleGetAnalyticsOverview(
    query: GetAnalyticsOverviewQuery,
  ): Observable<AnalyticsOverviewSnapshot>;
}

