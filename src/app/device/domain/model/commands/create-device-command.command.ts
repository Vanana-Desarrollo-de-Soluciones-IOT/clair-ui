import { DeviceId } from '../valueobjects/device-id.value-object';
import { DeviceCommandType } from '../valueobjects/device-command-type.value-object';

export type CreateDeviceCommandCommand = Readonly<{
  deviceId: DeviceId;
  type: DeviceCommandType;
  payload?: string;
}>;

export const createCreateDeviceCommandCommand = (
  deviceId: DeviceId,
  type: DeviceCommandType,
  payload?: string
): CreateDeviceCommandCommand => {
  const normalizedPayload = payload?.trim();
  if (normalizedPayload !== undefined && normalizedPayload.length === 0) {
    throw new Error('Payload must be a non-empty string when provided');
  }

  return Object.freeze({
    deviceId,
    type,
    payload: normalizedPayload,
  });
};
