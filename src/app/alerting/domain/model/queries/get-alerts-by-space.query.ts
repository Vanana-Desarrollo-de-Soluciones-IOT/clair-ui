export type GetAlertsBySpaceQuery = Readonly<{
  spaceId: string;
  page: number;
  size: number;
}>;

export const createGetAlertsBySpaceQuery = (
  spaceId: string,
  page: number = 0,
  size: number = 20
): GetAlertsBySpaceQuery => {
  if (!spaceId || spaceId.trim().length === 0) {
    throw new Error('Space ID is required for alerts query');
  }
  if (page < 0) {
    throw new Error('Page number must be non-negative');
  }
  if (size < 1 || size > 100) {
    throw new Error('Page size must be between 1 and 100');
  }
  return Object.freeze({
    spaceId: spaceId.trim(),
    page,
    size,
  });
};
