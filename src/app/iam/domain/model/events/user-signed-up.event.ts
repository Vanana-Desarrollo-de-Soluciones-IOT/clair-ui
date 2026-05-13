import { UserId } from '../valueobjects/user-id.value-object';
import { Email } from '../valueobjects/email.value-object';

export type UserSignedUpEvent = Readonly<{
  userId: UserId;
  email: Email;
  occurredOn: Date;
}>;

export const createUserSignedUpEvent = (userId: UserId, email: Email): UserSignedUpEvent => {
  return Object.freeze({ userId, email, occurredOn: new Date() });
};
