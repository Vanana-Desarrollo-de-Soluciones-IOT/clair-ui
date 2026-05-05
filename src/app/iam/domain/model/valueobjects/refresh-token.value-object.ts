export type RefreshToken = Readonly<{ value: string }>;

export const createRefreshToken = (token: string): RefreshToken => {
  if (!token) {
    throw new Error('Refresh token is required');
  }
  return Object.freeze({ value: token });
};
