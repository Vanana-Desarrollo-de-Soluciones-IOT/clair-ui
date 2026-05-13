export type Password = Readonly<{ value: string }>;

export const createPassword = (password: string): Password => {
  if (!password) {
    throw new Error('Password is required');
  }
  if (password.length < 8 || password.length > 128) {
    throw new Error('Password must be between 8 and 128 characters');
  }
  if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/.test(password)) {
    throw new Error('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
  }
  return Object.freeze({ value: password });
};
