import { Observable } from 'rxjs';
import { GetUserPlanQuery } from '../model/queries/get-user-plan.query';
import { PlanType } from '../model/valueobjects/plan-type.value-object';
import { UserId } from '../model/valueobjects/user-id.value-object';

export type UserPlanDomain = Readonly<{
  userId: UserId;
  plan: PlanType;
  subscriptionStatus: 'COMPLETED' | null;
}>;

export interface BillingQueryService {
  handleGetUserPlan(query: GetUserPlanQuery): Observable<UserPlanDomain>;
}
