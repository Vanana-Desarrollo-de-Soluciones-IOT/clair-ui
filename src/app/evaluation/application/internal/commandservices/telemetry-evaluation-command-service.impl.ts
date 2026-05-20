import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { TelemetryEvaluationCommandService } from '../../../domain/services/telemetry-evaluation-command-service';
import { EvaluateTelemetryCommand } from '../../../domain/model/commands/evaluate-telemetry.command';
import { TelemetryEvaluation } from '../../../domain/services/telemetry-evaluation-query-service';
import { TelemetryEvaluationHttpGateway } from '../../../infrastructure/api/gateways/telemetry-evaluation-http.gateway';
import { evaluateTelemetryCommandToResource } from '../../../interfaces/rest/transform/evaluate-telemetry.transform';
import { telemetryEvaluationResourceToDomain } from '../../../interfaces/rest/transform/telemetry-evaluation.transform';

@Injectable({ providedIn: 'root' })
export class TelemetryEvaluationCommandServiceImpl implements TelemetryEvaluationCommandService {
  constructor(private readonly gateway: TelemetryEvaluationHttpGateway) {}

  handleEvaluateTelemetry(command: EvaluateTelemetryCommand, apiKey: string): Observable<TelemetryEvaluation> {
    if (!apiKey || apiKey.trim().length === 0) {
      throw new Error('API key must not be empty');
    }
    return this.gateway
      .evaluateTelemetry(apiKey.trim(), evaluateTelemetryCommandToResource(command))
      .pipe(map((resource) => telemetryEvaluationResourceToDomain(resource)));
  }
}

