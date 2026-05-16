import { Observable } from 'rxjs';
import { GetUserPlanQuery } from '../model/queries/get-user-plan.query';
import { GetStripePublicKeyQuery } from '../model/queries/get-stripe-public-key.query';
import { PlanType } from '../model/valueobjects/plan-type.value-object';
import { StripePublicKey } from '../model/valueobjects/stripe-public-key.value-object';
import { UserId } from '../model/valueobjects/user-id.value-object';

export type UserPlanDomain = Readonly<{
  userId: UserId;
  plan: PlanType;
  subscriptionStatus: 'COMPLETED' | null;
}>;

export interface BillingQueryService {
  handleGetUserPlan(query: GetUserPlanQuery): Observable<UserPlanDomain>;
  handleGetStripePublicKey(query: GetStripePublicKeyQuery): Observable<StripePublicKey>;
}
