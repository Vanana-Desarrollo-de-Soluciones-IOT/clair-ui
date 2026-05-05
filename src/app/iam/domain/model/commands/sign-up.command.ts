import { Email } from '../valueobjects/email.value-object';
import { Password } from '../valueobjects/password.value-object';

export type SignUpCommand = Readonly<{
  email: Email;
  password: Password;
}>;

export const createSignUpCommand = (email: Email, password: Password): SignUpCommand => {
  return Object.freeze({ email, password });
};
