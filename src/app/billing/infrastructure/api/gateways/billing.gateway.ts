import { Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';
import { UserPlanResource } from '../../../interfaces/rest/resources/user-plan.resource';

export interface BillingGateway {
  getUserPlan(userId: string): Observable<UserPlanResource>;
}

export const BILLING_GATEWAY = new InjectionToken<BillingGateway>('BILLING_GATEWAY');
