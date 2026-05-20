import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../../../api.config';
import { EvaluateTelemetryResource } from '../../../interfaces/rest/resources/evaluate-telemetry.resource';
import {
  TelemetryEvaluationPageResource,
  TelemetryEvaluationResource,
} from '../../../interfaces/rest/resources/telemetry-evaluation.resource';
import { TelemetryEvaluationGateway } from './telemetry-evaluation.gateway';

@Injectable({ providedIn: 'root' })
export class TelemetryEvaluationHttpGateway implements TelemetryEvaluationGateway {
  private readonly baseUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.evaluations;

  constructor(private readonly http: HttpClient) {}

  evaluateTelemetry(apiKey: string, resource: EvaluateTelemetryResource): Observable<TelemetryEvaluationResource> {
    const headers = new HttpHeaders().set('X-API-Key', apiKey);
    return this.http.post<TelemetryEvaluationResource>(`${this.baseUrl}/telemetry`, resource, { headers });
  }

  getEvaluationsByDevice(deviceId: string, page: number, size: number): Observable<TelemetryEvaluationPageResource> {
    const params = new HttpParams().set('page', String(page)).set('size', String(size));
    return this.http.get<TelemetryEvaluationPageResource>(`${this.baseUrl}/devices/${deviceId}`, { params });
  }

  getLatestEvaluationByDevice(deviceId: string): Observable<TelemetryEvaluationResource> {
    return this.http.get<TelemetryEvaluationResource>(`${this.baseUrl}/devices/${deviceId}/latest`);
  }
}

