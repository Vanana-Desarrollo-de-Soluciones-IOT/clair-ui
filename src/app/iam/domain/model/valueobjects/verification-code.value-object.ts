export type VerificationCode = Readonly<{ value: string }>;

export const createVerificationCode = (code: string): VerificationCode => {
  if (!code) {
    throw new Error('Verification code is required');
  }
  if (!/^[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code.trim())) {
    throw new Error('Verification code must be in format XXXX-XXXX (uppercase alphanumeric)');
  }
  return Object.freeze({ value: code.trim() });
};
