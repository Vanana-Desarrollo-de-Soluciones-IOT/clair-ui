import { SpaceId } from '../valueobjects/space-id.value-object';
import { SerialNumber } from '../valueobjects/serial-number.value-object';

export type RegisterDeviceCommand = Readonly<{
  serialNumber: SerialNumber;
  name: string;
  spaceId: SpaceId;
}>;

export const createRegisterDeviceCommand = (
  serialNumber: SerialNumber,
  name: string,
  spaceId: SpaceId
): RegisterDeviceCommand => {
  if (!name || name.trim().length === 0) {
    throw new Error('Device name must not be empty');
  }
  return Object.freeze({ serialNumber, name: name.trim(), spaceId });
};
