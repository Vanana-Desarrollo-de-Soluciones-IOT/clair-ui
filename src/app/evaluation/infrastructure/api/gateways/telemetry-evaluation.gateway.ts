import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { EvaluateTelemetryResource } from '../../../interfaces/rest/resources/evaluate-telemetry.resource';
import {
  TelemetryEvaluationPageResource,
  TelemetryEvaluationResource,
} from '../../../interfaces/rest/resources/telemetry-evaluation.resource';

export interface TelemetryEvaluationGateway {
  evaluateTelemetry(apiKey: string, resource: EvaluateTelemetryResource): Observable<TelemetryEvaluationResource>;
  getEvaluationsByDevice(deviceId: string, page: number, size: number): Observable<TelemetryEvaluationPageResource>;
  getLatestEvaluationByDevice(deviceId: string): Observable<TelemetryEvaluationResource>;
}

export const TELEMETRY_EVALUATION_GATEWAY = new InjectionToken<TelemetryEvaluationGateway>(
  'TELEMETRY_EVALUATION_GATEWAY'
);

