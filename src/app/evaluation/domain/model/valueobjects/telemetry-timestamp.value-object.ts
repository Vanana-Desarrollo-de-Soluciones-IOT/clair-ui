export type TelemetryTimestamp = Readonly<{ value: string }>;

export const createTelemetryTimestamp = (value: string): TelemetryTimestamp => {
  const normalized = value.trim();
  if (normalized.length === 0) throw new Error('Telemetry timestamp must not be empty');
  return Object.freeze({ value: normalized });
};

