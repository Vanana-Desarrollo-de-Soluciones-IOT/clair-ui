export type UserId = Readonly<{ value: string }>;

export const createUserId = (id: string): UserId => {
  if (!id || id.trim().length === 0) {
    throw new Error('User ID must not be empty');
  }
  return Object.freeze({ value: id.trim() });
};
