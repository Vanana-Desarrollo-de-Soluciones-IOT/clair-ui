import { AirQuality } from '../valueobjects/air-quality.value-object';
import { Connectivity } from '../valueobjects/connectivity.value-object';
import { HealthStatus } from '../valueobjects/health-status.value-object';
import { Location } from '../valueobjects/location.value-object';
import { ParticulateMatter } from '../valueobjects/particulate-matter.value-object';
import { EvaluationDeviceId } from '../valueobjects/evaluation-device-id.value-object';
import { SystemUptime } from '../valueobjects/system-uptime.value-object';
import { TelemetryTimestamp } from '../valueobjects/telemetry-timestamp.value-object';

export type EvaluateTelemetryCommand = Readonly<{
  deviceId: EvaluationDeviceId;
  timestamp: TelemetryTimestamp['value'];
  uptime: SystemUptime['value'];
  airQuality: AirQuality;
  particulateMatter: ParticulateMatter;
  connectivity: Connectivity;
  location: Location;
  healthStatus: HealthStatus['value'];
  status: string;
  created_at?: string;
}>;

export const createEvaluateTelemetryCommand = (params: {
  deviceId: EvaluationDeviceId;
  timestamp: TelemetryTimestamp;
  uptime: SystemUptime;
  airQuality: AirQuality;
  particulateMatter: ParticulateMatter;
  connectivity: Connectivity;
  location: Location;
  healthStatus: HealthStatus;
  status: string;
  created_at?: string;
}): EvaluateTelemetryCommand => {
  const normalizedStatus = params.status.trim();
  if (normalizedStatus.length === 0) throw new Error('Status must not be empty');
  if (params.created_at !== undefined && params.created_at.trim().length === 0) {
    throw new Error('created_at must be non-empty when provided');
  }

  return Object.freeze({
    deviceId: params.deviceId,
    timestamp: params.timestamp.value,
    uptime: params.uptime.value,
    airQuality: params.airQuality,
    particulateMatter: params.particulateMatter,
    connectivity: params.connectivity,
    location: params.location,
    healthStatus: params.healthStatus.value,
    status: normalizedStatus,
    created_at: params.created_at?.trim(),
  });
};

