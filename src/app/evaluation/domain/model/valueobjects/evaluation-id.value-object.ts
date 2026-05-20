export type EvaluationId = Readonly<{ value: string }>;

export const createEvaluationId = (value: string): EvaluationId => {
  const normalized = value.trim();
  if (normalized.length === 0) throw new Error('EvaluationId must not be empty');
  return Object.freeze({ value: normalized });
};

