import { StripePublicKeyResource } from '../resources/stripe-public-key.resource';
import { StripePublicKey, createStripePublicKey } from '../../../domain/model/valueobjects/stripe-public-key.value-object';

export const stripePublicKeyResourceToDomain = (resource: StripePublicKeyResource): StripePublicKey => {
  return createStripePublicKey(resource.stripePublicKey);
};
