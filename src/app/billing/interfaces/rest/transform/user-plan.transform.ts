import { UserPlanDomain } from '../../../domain/services/billing-query-service';
import { createUserId } from '../../../domain/model/valueobjects/user-id.value-object';
import { createPlanType } from '../../../domain/model/valueobjects/plan-type.value-object';
import { UserPlanResource } from '../resources/user-plan.resource';

export const userPlanResourceToDomain = (resource: UserPlanResource): UserPlanDomain => {
  return Object.freeze({
    userId: createUserId(resource.userId),
    plan: createPlanType(resource.plan),
    subscriptionStatus: resource.subscriptionStatus,
  });
};
