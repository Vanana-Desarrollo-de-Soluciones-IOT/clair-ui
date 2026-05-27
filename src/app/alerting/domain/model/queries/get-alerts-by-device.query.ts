export type GetAlertsByDeviceQuery = Readonly<{
  deviceId: string;
  page: number;
  size: number;
}>;

export const createGetAlertsByDeviceQuery = (
  deviceId: string,
  page: number = 0,
  size: number = 20
): GetAlertsByDeviceQuery => {
  if (!deviceId || deviceId.trim().length === 0) {
    throw new Error('Device ID is required for alerts query');
  }
  if (page < 0) {
    throw new Error('Page number must be non-negative');
  }
  if (size < 1 || size > 100) {
    throw new Error('Page size must be between 1 and 100');
  }
  return Object.freeze({
    deviceId: deviceId.trim(),
    page,
    size,
  });
};
