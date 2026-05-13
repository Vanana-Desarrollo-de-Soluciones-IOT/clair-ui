import { Email } from '../valueobjects/email.value-object';
import { Password } from '../valueobjects/password.value-object';

export type SignInCommand = Readonly<{
  email: Email;
  password: Password;
}>;

export const createSignInCommand = (email: Email, password: Password): SignInCommand => {
  return Object.freeze({ email, password });
};
