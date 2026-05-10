export type GoogleIdToken = Readonly<{ value: string }>;

export const createGoogleIdToken = (token: string): GoogleIdToken => {
  if (!token || typeof token !== 'string') {
    throw new Error('Google ID token is required');
  }
  return Object.freeze({ value: token });
};
