export type AccessToken = Readonly<{ value: string }>;

export const createAccessToken = (token: string): AccessToken => {
  if (!token) {
    throw new Error('Access token is required');
  }
  return Object.freeze({ value: token });
};
