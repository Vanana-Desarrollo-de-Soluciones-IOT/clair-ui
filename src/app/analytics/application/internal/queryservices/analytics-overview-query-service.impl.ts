import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AnalyticsHttpGateway } from '../../../infrastructure/api/gateways/analytics-http.gateway';
import { AnalyticsOverviewQueryService } from '../../../domain/services/analytics-overview-query-service';
import { GetAnalyticsOverviewQuery } from '../../../domain/model/queries/get-analytics-overview.query';
import { AnalyticsOverviewSnapshot } from '../../../domain/model/valueobjects/analytics-overview.value-object';
import { analyticsOverviewResourceToDomain } from '../../../interfaces/rest/transform/analytics-overview.transform';

@Injectable({ providedIn: 'root' })
export class AnalyticsOverviewQueryServiceImpl
  implements AnalyticsOverviewQueryService
{
  constructor(private readonly gateway: AnalyticsHttpGateway) {}

  handleGetAnalyticsOverview(
    query: GetAnalyticsOverviewQuery,
  ): Observable<AnalyticsOverviewSnapshot> {
    return this.gateway
      .getOverview(query.deviceLimitPerSpace, query.alertLimit)
      .pipe(map(analyticsOverviewResourceToDomain));
  }
}
