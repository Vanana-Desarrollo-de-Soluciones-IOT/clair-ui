import { OrganizationId } from '../valueobjects/organization-id.value-object';
import { UserId } from '../valueobjects/user-id.value-object';

export type CreateSpaceCommand = Readonly<{
  name: string;
  organizationId: OrganizationId;
  ownerUserId: UserId;
}>;

export const createCreateSpaceCommand = (
  name: string,
  organizationId: OrganizationId,
  ownerUserId: UserId
): CreateSpaceCommand => {
  if (!name || name.trim().length === 0) {
    throw new Error('Space name must not be empty');
  }
  return Object.freeze({ name: name.trim(), organizationId, ownerUserId });
};
