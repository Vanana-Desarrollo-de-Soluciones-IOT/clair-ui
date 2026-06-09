import { EvaluateTelemetryCommand } from '../../../domain/model/commands/evaluate-telemetry.command';
import { EvaluateTelemetryResource } from '../resources/evaluate-telemetry.resource';

export const evaluateTelemetryCommandToResource = (command: EvaluateTelemetryCommand): EvaluateTelemetryResource => {
  return {
    deviceId: command.deviceId.value,
    timestamp: command.timestamp,
    uptime: command.uptime,
    airQuality: {
      co2: command.airQuality.co2,
      temperature: command.airQuality.temperature,
      humidity: command.airQuality.humidity,
    },
    particulateMatter: {
      pm1_0: command.particulateMatter.pm1_0,
      pm2_5: command.particulateMatter.pm2_5,
      pm10: command.particulateMatter.pm10,
    },
    connectivity: {
      status: command.connectivity.status,
      network: command.connectivity.network ?? null,
      signalStrength: command.connectivity.signalStrength ?? null,
    },
    location: {
      country: command.location.country ?? null,
    },
    healthStatus: command.healthStatus,
    status: command.status,
    created_at: command.created_at,
  };
};

