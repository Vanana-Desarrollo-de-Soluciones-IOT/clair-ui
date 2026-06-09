import { UserId } from '../valueobjects/user-id.value-object';

export type GetUserPlanQuery = Readonly<{
  userId: UserId;
}>;

export const createGetUserPlanQuery = (userId: UserId): GetUserPlanQuery => {
  return Object.freeze({ userId });
};
