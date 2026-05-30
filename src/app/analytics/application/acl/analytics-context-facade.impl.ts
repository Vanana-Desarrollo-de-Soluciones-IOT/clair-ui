import { ANALYTICS_OVERVIEW_QUERY_SERVICE, AnalyticsOverviewQueryService } from "../../domain/services/analytics-overview-query-service";
import { ANALYTICS_QUERY_SERVICE, AnalyticsQueryService } from "../../domain/services/analytics-query-service";
import { Inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import {
  AnalyticsContextDashboardMetrics,
  AnalyticsContextFacade,
} from "../../interfaces/acl/analytics-context-facade";

import { createGetDashboardMetricsQuery } from "../../domain/model/queries/get-dashboard-metrics.query";
import { createGetAnalyticsOverviewQuery } from "../../domain/model/queries/get-analytics-overview.query";
import { AnalyticsOverviewSnapshot } from "../../domain/model/valueobjects/analytics-overview.value-object";

@Injectable({ providedIn: "root" })
export class AnalyticsContextFacadeImpl implements AnalyticsContextFacade {
  constructor(
    @Inject(ANALYTICS_QUERY_SERVICE) private readonly queryService: AnalyticsQueryService,
    @Inject(ANALYTICS_OVERVIEW_QUERY_SERVICE) private readonly overviewQueryService: AnalyticsOverviewQueryService
  ) {}

  getLiveDashboardMetricsByDevice(
    deviceId: string,
  ): Observable<AnalyticsContextDashboardMetrics> {
    const query = createGetDashboardMetricsQuery(deviceId, "LIVE");
    return this.queryService.handleGetDashboardMetrics(query).pipe(
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
    return this.overviewQueryService.handleGetAnalyticsOverview(query);
  }
}
