export type GetPushNotificationsQuery = Readonly<{
  page: number;
}>;

const ensureNonNegativeInteger = (value: number, fieldName: string): void => {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`${fieldName} must be a non-negative integer.`);
  }
};

export const createGetPushNotificationsQuery = (
  page: number = 0,
): GetPushNotificationsQuery => {
  ensureNonNegativeInteger(page, 'page');

  return Object.freeze({
    page,
  });
};
