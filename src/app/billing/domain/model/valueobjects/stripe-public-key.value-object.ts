export type StripePublicKey = Readonly<{
  value: string;
}>;

export const createStripePublicKey = (value: string | null | undefined): StripePublicKey => {
  if (!value?.trim()) {
    throw new Error('Stripe public key is required');
  }

  if (!value.startsWith('pk_')) {
    throw new Error('Stripe public key must start with pk_');
  }

  return Object.freeze({ value });
};
