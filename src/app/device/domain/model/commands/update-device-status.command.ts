import { DeviceId } from '../valueobjects/device-id.value-object';
import { DeviceStatus } from '../valueobjects/device-status.value-object';

export type UpdateDeviceStatusCommand = Readonly<{
  deviceId: DeviceId;
  status: DeviceStatus;
}>;

export const createUpdateDeviceStatusCommand = (
  deviceId: DeviceId,
  status: DeviceStatus
): UpdateDeviceStatusCommand => {
  return Object.freeze({ deviceId, status });
};
