export interface CreateSubscriptionPaymentIntentResource {
  userId: string;
  amount: number;
  currency: string;
  returnUrl: string;
}
