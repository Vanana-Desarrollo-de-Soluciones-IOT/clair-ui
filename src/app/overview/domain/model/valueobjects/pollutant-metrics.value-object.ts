export type PollutantMetric = Readonly<{
  name: string;
  value: number | null;
  unit: string;
}>;

export const createPollutantMetric = (
  name: string,
  value: number | null,
  unit: string,
): PollutantMetric => {
  if (!name || name.trim().length === 0) throw new Error('Name is required');
  if (!unit || unit.trim().length === 0) throw new Error('Unit is required');

  return Object.freeze({
    name,
    value,
    unit,
  });
};
