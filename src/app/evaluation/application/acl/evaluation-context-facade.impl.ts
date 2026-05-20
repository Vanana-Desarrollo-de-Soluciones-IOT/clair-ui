import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { EvaluationContextFacade, LatestTelemetrySummary } from '../../interfaces/acl/evaluation-context-facade';
import { TelemetryEvaluationQueryServiceImpl } from '../internal/queryservices/telemetry-evaluation-query-service.impl';
import { createGetLatestEvaluationByDeviceQuery } from '../../domain/model/queries/get-latest-evaluation-by-device.query';
import { createEvaluationDeviceId } from '../../domain/model/valueobjects/evaluation-device-id.value-object';

@Injectable({ providedIn: 'root' })
export class EvaluationContextFacadeImpl implements EvaluationContextFacade {
  constructor(private readonly queryService: TelemetryEvaluationQueryServiceImpl) {}

  getLatestTelemetryByDevice(deviceId: string): Observable<LatestTelemetrySummary | null> {
    const query = createGetLatestEvaluationByDeviceQuery(createEvaluationDeviceId(deviceId));
    return this.queryService.handleGetLatestEvaluationByDevice(query).pipe(
      map((evaluation) => {
        if (!evaluation) return null;
        return {
          connectivityStatus: evaluation.connectivity.status,
          signalStrength: evaluation.connectivity.signalStrength,
          uptime: evaluation.uptime,
          healthStatus: evaluation.healthStatus,
          recordedAt: evaluation.recordedAt,
          pm2_5: evaluation.particulateMatter.pm2_5,
          co2: evaluation.airQuality.co2,
          temperature: evaluation.airQuality.temperature,
          humidity: evaluation.airQuality.humidity,
          network: evaluation.connectivity.network,
          locationCountry: evaluation.location.country,
        };
      }),
      catchError(() => of(null))
    );
  }
}
