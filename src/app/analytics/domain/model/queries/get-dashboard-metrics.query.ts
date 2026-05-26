export type GetDashboardMetricsQuery = Readonly<{
  deviceId: string;
  period?: string;
  startDate?: string;
  endDate?: string;
}>;

export const createGetDashboardMetricsQuery = (
  deviceId: string,
  period?: string,
  startDate?: string,
  endDate?: string
): GetDashboardMetricsQuery => {
  if (!deviceId || deviceId.trim().length === 0) {
    throw new Error('Device ID is required for dashboard metrics query');
  }
  return Object.freeze({
    deviceId: deviceId.trim(),
    period: period?.trim(),
    startDate: startDate?.trim(),
    endDate: endDate?.trim(),
  });
};
