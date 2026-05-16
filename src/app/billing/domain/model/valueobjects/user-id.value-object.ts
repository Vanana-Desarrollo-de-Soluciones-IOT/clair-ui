export type UserId = Readonly<{ value: string }>;

export const createUserId = (id: string): UserId => {
  if (!id || id.trim() === '') {
    throw new Error('UserId cannot be empty');
  }
  return Object.freeze({ value: id });
};
