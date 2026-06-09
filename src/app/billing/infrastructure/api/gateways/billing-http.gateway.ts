import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BillingGateway } from './billing.gateway';
import { UserPlanResource } from '../../../interfaces/rest/resources/user-plan.resource';
import { StripePublicKeyResource } from '../../../interfaces/rest/resources/stripe-public-key.resource';
import { CreateSubscriptionPaymentIntentResource } from '../../../interfaces/rest/resources/create-subscription-payment-intent.resource';
import { SubscriptionPaymentIntentResource } from '../../../interfaces/rest/resources/subscription-payment-intent.resource';
import { API_CONFIG } from '../../../../api.config';

@Injectable({ providedIn: 'root' })
export class BillingHttpGateway implements BillingGateway {
  private readonly baseUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.subscriptions;

  constructor(private readonly http: HttpClient) {}

  getUserPlan(userId: string): Observable<UserPlanResource> {
    return this.http.get<UserPlanResource>(`${this.baseUrl}/plans/${userId}`);
  }

  getStripePublicKey(): Observable<StripePublicKeyResource> {
    return this.http.get<StripePublicKeyResource>(`${API_CONFIG.baseUrl}/config/stripe-public-key`);
  }

  createSubscriptionPaymentIntent(
    resource: CreateSubscriptionPaymentIntentResource
  ): Observable<SubscriptionPaymentIntentResource> {
    return this.http.post<SubscriptionPaymentIntentResource>(`${this.baseUrl}/payment-intent`, resource);
  }
}
