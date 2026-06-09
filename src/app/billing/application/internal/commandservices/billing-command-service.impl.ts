import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BillingCommandService, SubscriptionPaymentIntentDomain } from '../../../domain/services/billing-command-service';
import { CreateSubscriptionPaymentIntentCommand } from '../../../domain/model/commands/create-subscription-payment-intent.command';
import {
  createSubscriptionPaymentIntentCommandToResource,
  subscriptionPaymentIntentResourceToDomain,
} from '../../../interfaces/rest/transform/subscription-payment-intent.transform';
import { BillingHttpGateway } from '../../../infrastructure/api/gateways/billing-http.gateway';

@Injectable({ providedIn: 'root' })
export class BillingCommandServiceImpl implements BillingCommandService {
  constructor(private readonly billingGateway: BillingHttpGateway) {}

  handleCreateSubscriptionPaymentIntent(
    command: CreateSubscriptionPaymentIntentCommand
  ): Observable<SubscriptionPaymentIntentDomain> {
    return this.billingGateway.createSubscriptionPaymentIntent(
      createSubscriptionPaymentIntentCommandToResource(command)
    ).pipe(
      map((resource) => subscriptionPaymentIntentResourceToDomain(resource))
    );
  }
}
