export type SerialNumber = Readonly<{ value: string }>;

export const createSerialNumber = (serial: string): SerialNumber => {
  if (!serial || serial.trim().length === 0) {
    throw new Error('Serial number must not be empty');
  }
  return Object.freeze({ value: serial.trim() });
};
