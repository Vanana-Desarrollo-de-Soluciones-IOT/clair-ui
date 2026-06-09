export type GetMonthlyReportQuery = Readonly<{
  deviceId: string;
  /** Calendar month (`YYYY-MM`). Omit for the previous completed month. */
  month?: string;
}>;

export const createGetMonthlyReportQuery = (
  deviceId: string,
  month?: string
): GetMonthlyReportQuery => {
  if (!deviceId || deviceId.trim().length === 0) {
    throw new Error('Device ID is required for monthly report query');
  }
  return Object.freeze({
    deviceId: deviceId.trim(),
    month: month?.trim() || undefined,
  });
};
