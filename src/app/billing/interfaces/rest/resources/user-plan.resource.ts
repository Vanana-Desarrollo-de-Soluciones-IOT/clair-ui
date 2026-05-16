export interface UserPlanResource {
  userId: string;
  plan: 'PREMIUM' | 'FREEMIUM' | 'VISITOR';
  subscriptionStatus: 'COMPLETED' | null;
}
