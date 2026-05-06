import { AccessToken } from '../valueobjects/access-token.value-object';

export type SignOutCommand = Readonly<{
  accessToken: AccessToken;
}>;

export const createSignOutCommand = (accessToken: AccessToken): SignOutCommand => {
  return Object.freeze({ accessToken });
};
