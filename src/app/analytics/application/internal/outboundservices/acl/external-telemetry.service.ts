import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { EVALUATION_CONTEXT_FACADE, EvaluationContextFacade, LatestTelemetrySummary } from '../../../../../evaluation/interfaces/acl/evaluation-context-facade';

@Injectable({ providedIn: 'root' })
export class ExternalTelemetryService {
  constructor(
    @Inject(EVALUATION_CONTEXT_FACADE)
    private readonly evaluationContextFacade: EvaluationContextFacade
  ) {}

  fetchLatestTelemetryByDevice(deviceId: string): Observable<LatestTelemetrySummary | null> {
    return this.evaluationContextFacade.getLatestTelemetryByDevice(deviceId);
  }
}
