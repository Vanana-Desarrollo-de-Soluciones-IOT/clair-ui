export type SystemUptime = Readonly<{ value: number }>;

export const createSystemUptime = (value: number): SystemUptime => {
  if (value < 0 || !Number.isInteger(value)) {
    throw new Error('System uptime must be a non-negative integer representing seconds');
  }
  return Object.freeze({ value });
};
