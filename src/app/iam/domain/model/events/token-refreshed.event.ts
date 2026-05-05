import { UserId } from '../valueobjects/user-id.value-object';

export type TokenRefreshedEvent = Readonly<{
  userId: UserId;
  occurredOn: Date;
}>;

export const createTokenRefreshedEvent = (userId: UserId): TokenRefreshedEvent => {
  return Object.freeze({ userId, occurredOn: new Date() });
};
