import { Injectable, Inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  EvaluationContextFacade,
  EVALUATION_CONTEXT_FACADE,
} from '../../../../../evaluation/interfaces/acl/evaluation-context-facade';

export type DeviceTelemetrySnapshot = Readonly<{
  connectivitySignalStrength: number | null;
  uptime: string;
  healthStatus: number;
  lastUpdateMinutes: number | null;
  network: string | null;
  location: string | null;
  pm2_5: number | null;
  co2: number | null;
  temperature: number | null;
  humidity: number | null;
}>;

@Injectable({ providedIn: 'root' })
export class ExternalTelemetryEvaluationService {
  constructor(
    @Inject(EVALUATION_CONTEXT_FACADE)
    private readonly evaluationContextFacade: EvaluationContextFacade
  ) {}

  fetchLatestTelemetryByDevice(deviceId: string): Observable<DeviceTelemetrySnapshot | null> {
    return this.evaluationContextFacade.getLatestTelemetryByDevice(deviceId).pipe(
      map((summary) => {
        if (!summary) return null;
        return {
          connectivitySignalStrength: summary.signalStrength,
          uptime: summary.uptime,
          healthStatus: summary.healthStatus,
          lastUpdateMinutes: this.computeMinutesSince(summary.recordedAt),
          network: summary.network,
          location: summary.locationCountry,
          pm2_5: summary.pm2_5,
          co2: summary.co2,
          temperature: summary.temperature,
          humidity: summary.humidity,
        };
      })
    );
  }

  private computeMinutesSince(recordedAt: string): number | null {
    try {
      const recorded = new Date(recordedAt);
      const now = new Date();
      const diffMs = now.getTime() - recorded.getTime();
      if (diffMs < 0) return 0;
      return Math.floor(diffMs / 60000);
    } catch {
      return null;
    }
  }
}
