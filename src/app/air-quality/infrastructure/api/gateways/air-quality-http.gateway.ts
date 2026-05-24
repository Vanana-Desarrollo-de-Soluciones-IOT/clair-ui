import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../../../api.config';
import { AirQualityGateway } from './air-quality.gateway';
import { AirQualityLiveResource } from '../../../interfaces/rest/resources/air-quality-live.resource';
import { AirQualityTrendsResource } from '../../../interfaces/rest/resources/air-quality-trends.resource';

@Injectable({ providedIn: 'root' })
export class AirQualityHttpGateway implements AirQualityGateway {
  private readonly baseUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.analytics;

  constructor(private readonly http: HttpClient) {}

  getLiveMetrics(deviceId: string): Observable<AirQualityLiveResource> {
    return this.http.get<AirQualityLiveResource>(`${this.baseUrl}/devices/${deviceId}/live`);
  }

  getTrendMetrics(deviceId: string, period: string): Observable<AirQualityTrendsResource> {
    const params = new HttpParams().set('period', period);
    return this.http.get<AirQualityTrendsResource>(`${this.baseUrl}/devices/${deviceId}/trends`, { params });
  }
}
