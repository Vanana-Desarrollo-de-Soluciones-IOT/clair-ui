import { Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';
import { UserPlanResource } from '../../../interfaces/rest/resources/user-plan.resource';
import { StripePublicKeyResource } from '../../../interfaces/rest/resources/stripe-public-key.resource';
import { CreateSubscriptionPaymentIntentResource } from '../../../interfaces/rest/resources/create-subscription-payment-intent.resource';
import { SubscriptionPaymentIntentResource } from '../../../interfaces/rest/resources/subscription-payment-intent.resource';

export interface BillingGateway {
  getUserPlan(userId: string): Observable<UserPlanResource>;
  getStripePublicKey(): Observable<StripePublicKeyResource>;
  createSubscriptionPaymentIntent(resource: CreateSubscriptionPaymentIntentResource): Observable<SubscriptionPaymentIntentResource>;
}

export const BILLING_GATEWAY = new InjectionToken<BillingGateway>('BILLING_GATEWAY');
