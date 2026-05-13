import { VerificationCode } from '../valueobjects/verification-code.value-object';

export type ConfirmRegistrationCommand = Readonly<{
  sessionId: string;
  code: VerificationCode;
}>;

export const createConfirmRegistrationCommand = (
  sessionId: string,
  code: VerificationCode
): ConfirmRegistrationCommand => {
  if (!sessionId || sessionId.trim().length === 0) {
    throw new Error('Session ID is required');
  }
  return Object.freeze({ sessionId: sessionId.trim(), code });
};
