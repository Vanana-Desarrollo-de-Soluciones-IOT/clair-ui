import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../../../api.config';
import { ReportGateway } from './report.gateway';
import { DailyReportResource, MonthlyReportResource } from '../../../interfaces/rest/resources/report.resource';

@Injectable({ providedIn: 'root' })
export class ReportHttpGateway implements ReportGateway {
  private readonly baseUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.analytics;

  constructor(private readonly http: HttpClient) {}

  getDailyReport(deviceId: string, date?: string): Observable<DailyReportResource> {
    let params = new HttpParams();
    if (date) params = params.set('date', date);

    return this.http.get<DailyReportResource>(
      `${this.baseUrl}/devices/${deviceId}/reports/daily`,
      { params }
    );
  }

  getMonthlyReport(deviceId: string, month?: string): Observable<MonthlyReportResource> {
    let params = new HttpParams();
    if (month) params = params.set('month', month);

    return this.http.get<MonthlyReportResource>(
      `${this.baseUrl}/devices/${deviceId}/reports/monthly`,
      { params }
    );
  }
}
