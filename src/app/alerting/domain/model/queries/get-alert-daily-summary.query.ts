export type GetAlertDailySummaryQuery = Readonly<{
  days: number;
}>;

export const createGetAlertDailySummaryQuery = (
  days: number = 30
): GetAlertDailySummaryQuery => {
  if (!Number.isInteger(days) || days < 1 || days > 365) {
    throw new Error('Daily alert summary days must be between 1 and 365');
  }
  return Object.freeze({ days });
};
