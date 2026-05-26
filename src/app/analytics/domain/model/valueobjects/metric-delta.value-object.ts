export type MetricDelta = Readonly<{
  value: number;
  deltaPercentage: number | null;
}>;

export const createMetricDelta = (value: number, deltaPercentage: number | null): MetricDelta => {
  if (!Number.isFinite(value)) {
    throw new Error('Metric value must be a finite number');
  }
  if (deltaPercentage !== null && !Number.isFinite(deltaPercentage)) {
    throw new Error('Delta percentage must be null or a finite number');
  }
  return Object.freeze({ value, deltaPercentage });
};
