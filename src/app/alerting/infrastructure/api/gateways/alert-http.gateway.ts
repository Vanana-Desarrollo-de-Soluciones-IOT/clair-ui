import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../../../api.config';
import { AlertGateway } from './alert.gateway';
import { AlertPageResource } from '../../../interfaces/rest/resources/alert-page.resource';

@Injectable({ providedIn: 'root' })
export class AlertHttpGateway implements AlertGateway {
  private readonly baseUrl = API_CONFIG.baseUrl + '/v1';

  constructor(private readonly http: HttpClient) {}

  getAlertsByDevice(deviceId: string, page: number, size: number): Observable<AlertPageResource> {
    return this.http.get<AlertPageResource>(`${this.baseUrl}/devices/${deviceId}/alerts`, {
      params: { page: page.toString(), size: size.toString() },
    });
  }

  getAlertsBySpace(spaceId: string, page: number, size: number): Observable<AlertPageResource> {
    return this.http.get<AlertPageResource>(`${this.baseUrl}/spaces/${spaceId}/alerts`, {
      params: { page: page.toString(), size: size.toString() },
    });
  }
}
