import { DeviceId } from '../valueobjects/device-id.value-object';
import { SerialNumber } from '../valueobjects/serial-number.value-object';

export type UpdateDeviceSerialNumberCommand = Readonly<{
  deviceId: DeviceId;
  serialNumber: SerialNumber;
}>;

export const createUpdateDeviceSerialNumberCommand = (
  deviceId: DeviceId,
  serialNumber: SerialNumber
): UpdateDeviceSerialNumberCommand => {
  return Object.freeze({ deviceId, serialNumber });
};
