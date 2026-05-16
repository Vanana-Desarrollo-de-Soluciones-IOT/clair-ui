import { UserId } from '../valueobjects/user-id.value-object';

export type GetSpacesByOwnerQuery = Readonly<{
  ownerUserId: UserId;
}>;

export const createGetSpacesByOwnerQuery = (
  ownerUserId: UserId
): GetSpacesByOwnerQuery => {
  return Object.freeze({ ownerUserId });
};
