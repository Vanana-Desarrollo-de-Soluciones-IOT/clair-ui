export type HardwareId = Readonly<{ value: string }>;

export const createHardwareId = (value: string): HardwareId => {
  const normalized = value.trim();
  if (normalized.length === 0) {
    throw new Error('Hardware ID must not be empty');
  }
  if (!/^(CLAIR|HW)-\d{4}$/.test(normalized)) {
    throw new Error('Hardware ID must match CLAIR-0001');
  }
  return Object.freeze({ value: normalized });
};
