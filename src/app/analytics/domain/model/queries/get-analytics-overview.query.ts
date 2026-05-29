export type GetAnalyticsOverviewQuery = Readonly<{
  deviceLimitPerSpace?: number;
  alertLimit?: number;
}>;

export const createGetAnalyticsOverviewQuery = (
  deviceLimitPerSpace?: number,
  alertLimit?: number,
): GetAnalyticsOverviewQuery => {
  if (deviceLimitPerSpace !== undefined) {
    if (!Number.isInteger(deviceLimitPerSpace) || deviceLimitPerSpace <= 0) {
      throw new Error('Device limit per space must be a positive integer');
    }
  }
  if (alertLimit !== undefined) {
    if (!Number.isInteger(alertLimit) || alertLimit < 0) {
      throw new Error('Alert limit must be a non-negative integer');
    }
  }
  return Object.freeze({ deviceLimitPerSpace, alertLimit });
};

