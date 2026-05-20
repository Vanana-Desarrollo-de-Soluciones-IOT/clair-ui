export type EvaluationDeviceId = Readonly<{ value: string }>;

export const createEvaluationDeviceId = (value: string): EvaluationDeviceId => {
  const normalized = value.trim();
  if (normalized.length === 0) throw new Error('DeviceId must not be empty');
  return Object.freeze({ value: normalized });
};

