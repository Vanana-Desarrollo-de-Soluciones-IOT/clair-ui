export type DeviceStatus = 'OFFLINE' | 'ONLINE' | 'MAINTENANCE' | 'DECOMMISSIONED';

export const createDeviceStatus = (status: string): DeviceStatus => {
  const upper = status.toUpperCase();
  if (upper === 'OFFLINE' || upper === 'ONLINE' || upper === 'MAINTENANCE' || upper === 'DECOMMISSIONED') {
    return upper as DeviceStatus;
  }
  throw new Error(`Invalid device status: ${status}`);
};
