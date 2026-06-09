import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../../../api.config';
import { AlertGateway } from './alert.gateway';
import { AlertPageResource } from '../../../interfaces/rest/resources/alert-page.resource';
import { DailyAlertSummaryResource } from '../../../interfaces/rest/resources/daily-alert-summary.resource';

@Injectable({ providedIn: 'root' })
export class AlertHttpGateway implements AlertGateway {
  private readonly baseUrl = API_CONFIG.baseUrl + '/v1';

  constructor(private readonly http: HttpClient) {}

  getAlerts(page: number, size: number, status?: string[]): Observable<AlertPageResource> {
    const params = this.alertPageParams(page, size, status);
    return this.http.get<AlertPageResource>(`${this.baseUrl}/alerts`, { params });
  }

  getAlertsByDevice(deviceId: string, page: number, size: number, status?: string[]): Observable<AlertPageResource> {
    const params = this.alertPageParams(page, size, status);
    return this.http.get<AlertPageResource>(`${this.baseUrl}/devices/${deviceId}/alerts`, { params });
  }

  getAlertsBySpace(spaceId: string, page: number, size: number, status?: string[]): Observable<AlertPageResource> {
    const params = this.alertPageParams(page, size, status);
    return this.http.get<AlertPageResource>(`${this.baseUrl}/spaces/${spaceId}/alerts`, { params });
  }

  getCurrentUserDailyAlertSummary(days: number): Observable<DailyAlertSummaryResource[]> {
    return this.http.get<DailyAlertSummaryResource[]>(`${this.baseUrl}/alerts/daily-summary`, {
      params: { days: days.toString() },
    });
  }

  getDailyAlertSummary(spaceId: string, days: number): Observable<DailyAlertSummaryResource[]> {
    return this.http.get<DailyAlertSummaryResource[]>(`${this.baseUrl}/spaces/${spaceId}/alerts/daily-summary`, {
      params: { days: days.toString() },
    });
  }

  private alertPageParams(page: number, size: number, status?: string[]): HttpParams {
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    if (status && status.length > 0) {
      status.forEach((s) => { params = params.append('status', s); });
    }
    return params;
  }
}
