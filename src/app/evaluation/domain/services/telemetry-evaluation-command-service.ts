import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { EvaluateTelemetryCommand } from '../model/commands/evaluate-telemetry.command';
import { TelemetryEvaluation } from './telemetry-evaluation-query-service';

export interface TelemetryEvaluationCommandService {
  handleEvaluateTelemetry(command: EvaluateTelemetryCommand, apiKey: string): Observable<TelemetryEvaluation>;
}



export const TELEMETRY_EVALUATION_COMMAND_SERVICE = new InjectionToken<TelemetryEvaluationCommandService>('TelemetryEvaluationCommandService');
