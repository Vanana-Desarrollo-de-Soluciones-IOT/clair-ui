import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { API_CONFIG } from "../../../../api.config";
import { AnalyticsGateway } from "./analytics.gateway";
import { DashboardMetricsResource } from "../../../interfaces/rest/resources/dashboard-metrics.resource";
import { TrendsResource } from "../../../interfaces/rest/resources/trends.resource";
import { AnalyticsOverviewResource } from "../../../interfaces/rest/resources/analytics-overview.resource";

@Injectable({ providedIn: "root" })
export class AnalyticsHttpGateway implements AnalyticsGateway {
  private readonly baseUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.analytics;

  constructor(private readonly http: HttpClient) {}

  getDashboardMetrics(
    deviceId: string,
    period?: string,
    startDate?: string,
    endDate?: string
  ): Observable<DashboardMetricsResource> {
    let params = new HttpParams();
    
    // Determine if we should call /live or /historical
    const isLive = !period || period.toUpperCase() === "LIVE";
    const endpoint = isLive ? "live" : "historical";

    if (period && !isLive) params = params.set("period", period);
    if (startDate) params = params.set("startDate", startDate);
    if (endDate) params = params.set("endDate", endDate);

    return this.http.get<DashboardMetricsResource>(`${this.baseUrl}/devices/${deviceId}/${endpoint}`, { params });
  }

  getTrends(
    deviceId: string,
    period?: string,
    startDate?: string,
    endDate?: string
  ): Observable<TrendsResource> {
    let params = new HttpParams();
    if (period) params = params.set("period", period);
    if (startDate) params = params.set("startDate", startDate);
    if (endDate) params = params.set("endDate", endDate);

    return this.http.get<TrendsResource>(`${this.baseUrl}/devices/${deviceId}/trends`, { params });
  }

  getOverview(
    deviceLimitPerSpace?: number,
    alertLimit?: number,
  ): Observable<AnalyticsOverviewResource> {
    let params = new HttpParams();
    if (Number.isFinite(deviceLimitPerSpace as number)) {
      params = params.set("deviceLimitPerSpace", String(deviceLimitPerSpace));
    }
    if (Number.isFinite(alertLimit as number)) {
      params = params.set("alertLimit", String(alertLimit));
    }

    return this.http.get<AnalyticsOverviewResource>(`${this.baseUrl}/overview`, { params });
  }
}
