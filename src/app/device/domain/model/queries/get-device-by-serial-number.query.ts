import { SerialNumber } from '../valueobjects/serial-number.value-object';

export type GetDeviceBySerialNumberQuery = Readonly<{
  serialNumber: SerialNumber;
}>;

export const createGetDeviceBySerialNumberQuery = (
  serialNumber: SerialNumber
): GetDeviceBySerialNumberQuery => {
  return Object.freeze({ serialNumber });
};
