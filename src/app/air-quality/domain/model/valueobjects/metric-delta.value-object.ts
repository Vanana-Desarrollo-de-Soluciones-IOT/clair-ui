export type MetricDelta = Readonly<{
  value: number;
  deltaPercentage: number;
}>;

export const createMetricDelta = (value: number, deltaPercentage: number): MetricDelta => {
  if (!Number.isFinite(value)) {
    throw new Error('Metric value must be a finite number');
  }
  if (!Number.isFinite(deltaPercentage)) {
    throw new Error('Delta percentage must be a finite number');
  }
  return Object.freeze({ value, deltaPercentage });
};
