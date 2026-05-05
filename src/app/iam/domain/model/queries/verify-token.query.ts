import { AccessToken } from '../valueobjects/access-token.value-object';

export type VerifyTokenQuery = Readonly<{
  accessToken: AccessToken;
}>;

export const createVerifyTokenQuery = (accessToken: AccessToken): VerifyTokenQuery => {
  return Object.freeze({ accessToken });
};
