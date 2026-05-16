import { Observable } from 'rxjs';
import { CreateSubscriptionPaymentIntentCommand } from '../model/commands/create-subscription-payment-intent.command';

export type SubscriptionPaymentIntentDomain = Readonly<{
  clientSecret: string;
}>;

export interface BillingCommandService {
  handleCreateSubscriptionPaymentIntent(
    command: CreateSubscriptionPaymentIntentCommand
  ): Observable<SubscriptionPaymentIntentDomain>;
}
