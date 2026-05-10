import { GoogleIdToken } from '../valueobjects/google-id-token.value-object';

export type SignInWithGoogleCommand = Readonly<{
  idToken: GoogleIdToken;
}>;

export const createSignInWithGoogleCommand = (idToken: GoogleIdToken): SignInWithGoogleCommand => {
  return Object.freeze({ idToken });
};
