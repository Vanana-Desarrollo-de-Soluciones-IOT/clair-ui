export type SystemUptime = Readonly<{ value: string }>;

export const createSystemUptime = (value: string): SystemUptime => {
  const normalized = value.trim();
  if (normalized.length === 0) throw new Error('System uptime must not be empty');
  return Object.freeze({ value: normalized });
};

