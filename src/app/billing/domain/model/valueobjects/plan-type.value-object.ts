export type PlanType = 'VISITOR' | 'FREEMIUM' | 'PREMIUM';

export const createPlanType = (type: string): PlanType => {
  const upperType = type.toUpperCase();
  if (upperType === 'VISITOR' || upperType === 'FREEMIUM' || upperType === 'PREMIUM') {
    return upperType as PlanType;
  }
  throw new Error(`Invalid plan type: ${type}`);
};
