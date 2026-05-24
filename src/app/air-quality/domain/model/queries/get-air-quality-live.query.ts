export type GetAirQualityLiveQuery = Readonly<{
  deviceId: string;
}>;

export const createGetAirQualityLiveQuery = (deviceId: string): GetAirQualityLiveQuery => {
  if (!deviceId || deviceId.trim().length === 0) {
    throw new Error('Device ID is required for live air quality query');
  }
  return Object.freeze({ deviceId: deviceId.trim() });
};
