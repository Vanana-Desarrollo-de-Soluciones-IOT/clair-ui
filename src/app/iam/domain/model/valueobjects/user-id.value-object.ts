export type UserId = Readonly<{ value: string }>;

export const createUserId = (id: string): UserId => {
  if (!id || id.trim().length === 0) {
    throw new Error('User ID is required');
  }
  return Object.freeze({ value: id.trim() });
};
