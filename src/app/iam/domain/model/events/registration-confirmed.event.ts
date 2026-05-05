import { UserId } from '../valueobjects/user-id.value-object';
import { Email } from '../valueobjects/email.value-object';

export type RegistrationConfirmedEvent = Readonly<{
  userId: UserId;
  email: Email;
  occurredOn: Date;
}>;

export const createRegistrationConfirmedEvent = (
  userId: UserId,
  email: Email
): RegistrationConfirmedEvent => {
  return Object.freeze({ userId, email, occurredOn: new Date() });
};
