export type Email = Readonly<{ value: string }>;

export const createEmail = (email: string): Email => {
  const trimmed = email?.trim();
  if (!trimmed) {
    throw new Error('Email is required');
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    throw new Error('Email format is invalid');
  }
  return Object.freeze({ value: trimmed.toLowerCase() });
};
