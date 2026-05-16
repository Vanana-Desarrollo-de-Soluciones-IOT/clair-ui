import { UserId } from '../valueobjects/user-id.value-object';

export type CreateSubscriptionPaymentIntentCommand = Readonly<{
  userId: UserId;
  amount: number;
  currency: string;
  returnUrl: string;
}>;

export const createSubscriptionPaymentIntentCommand = (
  userId: UserId,
  amount: number,
  currency: string,
  returnUrl: string
): CreateSubscriptionPaymentIntentCommand => {
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error('Payment amount must be a positive integer');
  }

  if (!currency.trim()) {
    throw new Error('Payment currency is required');
  }

  if (!returnUrl.trim()) {
    throw new Error('Payment return URL is required');
  }

  return Object.freeze({ userId, amount, currency, returnUrl });
};
