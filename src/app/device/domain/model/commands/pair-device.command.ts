export type PairDeviceCommand = Readonly<{
  hardwareId: string;
  deviceType: string;
}>;

export const createPairDeviceCommand = (
  hardwareId: string,
  deviceType: string
): PairDeviceCommand => {
  const normalizedHardwareId = hardwareId.trim();
  const normalizedDeviceType = deviceType.trim();
  if (normalizedHardwareId.length === 0) {
    throw new Error('Hardware ID must not be empty');
  }
  if (normalizedDeviceType.length === 0) {
    throw new Error('Device type must not be empty');
  }
  return Object.freeze({ hardwareId: normalizedHardwareId, deviceType: normalizedDeviceType });
};
