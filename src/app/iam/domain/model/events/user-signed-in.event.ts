import { UserId } from '../valueobjects/user-id.value-object';
import { Email } from '../valueobjects/email.value-object';

export type UserSignedInEvent = Readonly<{
  userId: UserId;
  email: Email;
  occurredOn: Date;
}>;

export const createUserSignedInEvent = (userId: UserId, email: Email): UserSignedInEvent => {
  return Object.freeze({ userId, email, occurredOn: new Date() });
};
