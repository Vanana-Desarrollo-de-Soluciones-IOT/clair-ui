import { Observable } from 'rxjs';
import { EvaluateTelemetryCommand } from '../model/commands/evaluate-telemetry.command';
import { TelemetryEvaluation } from './telemetry-evaluation-query-service';

export interface TelemetryEvaluationCommandService {
  handleEvaluateTelemetry(command: EvaluateTelemetryCommand, apiKey: string): Observable<TelemetryEvaluation>;
}

