import { CreateSubscriptionPaymentIntentCommand } from '../../../domain/model/commands/create-subscription-payment-intent.command';
import { SubscriptionPaymentIntentDomain } from '../../../domain/services/billing-command-service';
import { CreateSubscriptionPaymentIntentResource } from '../resources/create-subscription-payment-intent.resource';
import { SubscriptionPaymentIntentResource } from '../resources/subscription-payment-intent.resource';

export const createSubscriptionPaymentIntentCommandToResource = (
  command: CreateSubscriptionPaymentIntentCommand
): CreateSubscriptionPaymentIntentResource => {
  return {
    userId: command.userId.value,
    amount: command.amount,
    currency: command.currency,
    returnUrl: command.returnUrl,
  };
};

export const subscriptionPaymentIntentResourceToDomain = (
  resource: SubscriptionPaymentIntentResource
): SubscriptionPaymentIntentDomain => {
  if (!resource.clientSecret?.trim()) {
    throw new Error('Payment intent client secret is required');
  }

  return Object.freeze({ clientSecret: resource.clientSecret });
};
