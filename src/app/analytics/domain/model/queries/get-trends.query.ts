export type GetTrendsQuery = Readonly<{
  deviceId: string;
  period?: string;
  startDate?: string;
  endDate?: string;
}>;

export const createGetTrendsQuery = (
  deviceId: string,
  period?: string,
  startDate?: string,
  endDate?: string
): GetTrendsQuery => {
  if (!deviceId || deviceId.trim().length === 0) {
    throw new Error('Device ID is required for trends query');
  }
  return Object.freeze({
    deviceId: deviceId.trim(),
    period: period?.trim(),
    startDate: startDate?.trim(),
    endDate: endDate?.trim(),
  });
};
