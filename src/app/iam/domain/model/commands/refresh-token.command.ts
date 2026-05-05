import { RefreshToken } from '../valueobjects/refresh-token.value-object';

export type RefreshTokenCommand = Readonly<{
  refreshToken: RefreshToken;
}>;

export const createRefreshTokenCommand = (refreshToken: RefreshToken): RefreshTokenCommand => {
  return Object.freeze({ refreshToken });
};
