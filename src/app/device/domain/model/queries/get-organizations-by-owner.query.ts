import { UserId } from '../valueobjects/user-id.value-object';

export type GetOrganizationsByOwnerQuery = Readonly<{
  ownerUserId: UserId;
}>;

export const createGetOrganizationsByOwnerQuery = (
  ownerUserId: UserId
): GetOrganizationsByOwnerQuery => {
  return Object.freeze({ ownerUserId });
};
