import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { TelemetryEvaluationQueryService } from '../../../domain/services/telemetry-evaluation-query-service';
import { GetEvaluationsByDeviceQuery } from '../../../domain/model/queries/get-evaluations-by-device.query';
import { GetLatestEvaluationByDeviceQuery } from '../../../domain/model/queries/get-latest-evaluation-by-device.query';
import { TelemetryEvaluationHttpGateway } from '../../../infrastructure/api/gateways/telemetry-evaluation-http.gateway';
import {
  telemetryEvaluationPageResourceToDomain,
  telemetryEvaluationResourceToDomain,
} from '../../../interfaces/rest/transform/telemetry-evaluation.transform';
import { TelemetryEvaluation, TelemetryEvaluationPage } from '../../../domain/services/telemetry-evaluation-query-service';

@Injectable({ providedIn: 'root' })
export class TelemetryEvaluationQueryServiceImpl implements TelemetryEvaluationQueryService {
  constructor(private readonly gateway: TelemetryEvaluationHttpGateway) {}

  handleGetEvaluationsByDevice(query: GetEvaluationsByDeviceQuery): Observable<TelemetryEvaluationPage> {
    return this.gateway
      .getEvaluationsByDevice(query.deviceId.value, query.page, query.size)
      .pipe(map((resource) => telemetryEvaluationPageResourceToDomain(resource)));
  }

  handleGetLatestEvaluationByDevice(query: GetLatestEvaluationByDeviceQuery): Observable<TelemetryEvaluation | null> {
    return this.gateway.getLatestEvaluationByDevice(query.deviceId.value).pipe(
      map((resource) => telemetryEvaluationResourceToDomain(resource)),
      catchError(() => of(null))
    );
  }
}

