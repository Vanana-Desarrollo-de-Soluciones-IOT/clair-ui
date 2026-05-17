export type PairDeviceCommand = Readonly<{
  hardwareId: string;
}>;

export const createPairDeviceCommand = (hardwareId: string): PairDeviceCommand => {
  const normalizedHardwareId = hardwareId.trim();
  if (normalizedHardwareId.length === 0) {
    throw new Error('Hardware ID must not be empty');
  }

  // Expected user-facing format: CLAIR-0001
  if (!/^(CLAIR|HW)-\d{4}$/.test(normalizedHardwareId)) {
    throw new Error('Hardware ID must match CLAIR-0001');
  }

  return Object.freeze({ hardwareId: normalizedHardwareId });
};
