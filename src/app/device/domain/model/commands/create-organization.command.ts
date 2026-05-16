import { OrganizationId } from '../valueobjects/organization-id.value-object';
import { UserId } from '../valueobjects/user-id.value-object';

export type CreateOrganizationCommand = Readonly<{
  name: string;
  ownerUserId: UserId;
}>;

export const createCreateOrganizationCommand = (
  name: string,
  ownerUserId: UserId
): CreateOrganizationCommand => {
  if (!name || name.trim().length === 0) {
    throw new Error('Organization name must not be empty');
  }
  return Object.freeze({ name: name.trim(), ownerUserId });
};
