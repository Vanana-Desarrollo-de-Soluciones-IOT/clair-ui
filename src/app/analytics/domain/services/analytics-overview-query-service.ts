import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { GetAnalyticsOverviewQuery } from '../model/queries/get-analytics-overview.query';
import { AnalyticsOverviewSnapshot } from '../model/valueobjects/analytics-overview.value-object';

export interface AnalyticsOverviewQueryService {
  handleGetAnalyticsOverview(
    query: GetAnalyticsOverviewQuery,
  ): Observable<AnalyticsOverviewSnapshot>;
}



export const ANALYTICS_OVERVIEW_QUERY_SERVICE = new InjectionToken<AnalyticsOverviewQueryService>('AnalyticsOverviewQueryService');
