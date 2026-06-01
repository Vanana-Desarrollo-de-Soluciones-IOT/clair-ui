import { Injectable, NgZone, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../../../api.config';
import { AnalyticsGateway } from './analytics.gateway';
import { DashboardMetricsResource } from '../../../interfaces/rest/resources/dashboard-metrics.resource';
import { TrendsResource } from '../../../interfaces/rest/resources/trends.resource';
import { AnalyticsOverviewResource } from '../../../interfaces/rest/resources/analytics-overview.resource';
import { LiveTelemetry } from '../../../domain/services/analytics-query-service';
import { TOKEN_STORAGE_GATEWAY, TokenStorageGateway } from '../../../../iam/infrastructure/storage/token-storage.gateway';

@Injectable({ providedIn: 'root' })
export class AnalyticsHttpGateway implements AnalyticsGateway {
  private readonly baseUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.analytics;
  private readonly tokenStorage = inject<TokenStorageGateway>(TOKEN_STORAGE_GATEWAY);

  constructor(
    private readonly http: HttpClient,
    private readonly zone: NgZone,
  ) {}


  getDashboardMetrics(
    deviceId: string,
    period?: string,
    startDate?: string,
    endDate?: string,
  ): Observable<DashboardMetricsResource> {
    let params = new HttpParams();

    // Determine if we should call /live or /historical
    const isLive = !period || period.toUpperCase() === 'LIVE';
    const endpoint = isLive ? 'live' : 'historical';

    if (period && !isLive) params = params.set('period', period);
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);

    return this.http.get<DashboardMetricsResource>(
      `${this.baseUrl}/devices/${deviceId}/${endpoint}`,
      { params },
    );
  }

  getTrends(
    deviceId: string,
    period?: string,
    startDate?: string,
    endDate?: string,
  ): Observable<TrendsResource> {
    let params = new HttpParams();
    if (period) params = params.set('period', period);
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);

    return this.http.get<TrendsResource>(`${this.baseUrl}/devices/${deviceId}/trends`, { params });
  }

  getOverview(
    deviceLimitPerSpace?: number,
    alertLimit?: number,
  ): Observable<AnalyticsOverviewResource> {
    let params = new HttpParams();
    if (Number.isFinite(deviceLimitPerSpace as number)) {
      params = params.set('deviceLimitPerSpace', String(deviceLimitPerSpace));
    }
    if (Number.isFinite(alertLimit as number)) {
      params = params.set('alertLimit', String(alertLimit));
    }

    return this.http.get<AnalyticsOverviewResource>(`${this.baseUrl}/overview`, { params });
  }

  streamLiveTelemetry(deviceId: string): Observable<LiveTelemetry> {
    return new Observable<LiveTelemetry>((observer) => {
      const token = this.tokenStorage.getAccessToken();
      const url = `${this.baseUrl}/devices/${deviceId}/live/stream` + (token ? `?token=${token}` : '');
      const eventSource = new EventSource(url);

      eventSource.addEventListener('telemetry', (event: MessageEvent) => {
        this.zone.run(() => {
          try {
            const data: LiveTelemetry = JSON.parse(event.data);
            observer.next(data);
          } catch (err) {
            console.error('SSE telemetry JSON parse error:', err);
          }
        });
      });

      eventSource.addEventListener('connected', (event: MessageEvent) => {
        console.log('SSE Stream Connected:', event.data);
      });

      eventSource.onerror = (error) => {
        this.zone.run(() => {
          console.warn('SSE connection closed or error, browser will auto-reconnect.', error);
        });
      };

      return () => {
        eventSource.close();
        console.log('SSE connection closed by client subscription teardown.');
      };
    });
  }
}
