export type GetAirQualityTrendsQuery = Readonly<{
  deviceId: string;
  period: string;
}>;

export const createGetAirQualityTrendsQuery = (deviceId: string, period: string): GetAirQualityTrendsQuery => {
  if (!deviceId || deviceId.trim().length === 0) {
    throw new Error('Device ID is required for air quality trends query');
  }
  if (!period || period.trim().length === 0) {
    throw new Error('Period is required for air quality trends query');
  }
  return Object.freeze({
    deviceId: deviceId.trim(),
    period: period.trim(),
  });
};
