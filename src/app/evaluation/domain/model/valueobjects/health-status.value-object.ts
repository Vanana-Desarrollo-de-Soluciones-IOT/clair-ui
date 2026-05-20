export type HealthStatus = Readonly<{ value: number }>;

export const createHealthStatus = (value: number): HealthStatus => {
  if (!Number.isInteger(value) || value < 0 || value > 100) {
    throw new Error('HealthStatus must be an integer between 0 and 100');
  }
  return Object.freeze({ value });
};

