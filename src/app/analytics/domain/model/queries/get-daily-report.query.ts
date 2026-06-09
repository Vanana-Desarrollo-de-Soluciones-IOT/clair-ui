export type GetDailyReportQuery = Readonly<{
  deviceId: string;
  /** Calendar day (`YYYY-MM-DD`). Omit for the latest completed day. */
  date?: string;
}>;

export const createGetDailyReportQuery = (
  deviceId: string,
  date?: string
): GetDailyReportQuery => {
  if (!deviceId || deviceId.trim().length === 0) {
    throw new Error('Device ID is required for daily report query');
  }
  return Object.freeze({
    deviceId: deviceId.trim(),
    date: date?.trim() || undefined,
  });
};
