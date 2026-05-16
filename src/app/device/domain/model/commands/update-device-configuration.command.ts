import { DeviceId } from '../valueobjects/device-id.value-object';

export type UpdateDeviceConfigurationCommand = Readonly<{
  deviceId: DeviceId;
  configuration: Record<string, string>;
}>;

export const createUpdateDeviceConfigurationCommand = (
  deviceId: DeviceId,
  configuration: Record<string, string>
): UpdateDeviceConfigurationCommand => {
  return Object.freeze({ deviceId, configuration });
};
