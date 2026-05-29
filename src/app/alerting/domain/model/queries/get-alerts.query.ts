export type GetAlertsQuery = Readonly<{
  page: number;
  size: number;
}>;

export const createGetAlertsQuery = (
  page: number = 0,
  size: number = 20
): GetAlertsQuery => {
  if (!Number.isInteger(page) || page < 0) {
    throw new Error('Page number must be a non-negative integer');
  }
  if (!Number.isInteger(size) || size < 1 || size > 100) {
    throw new Error('Page size must be between 1 and 100');
  }
  return Object.freeze({ page, size });
};
