export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'LOW';

export const AlertSeverities: readonly AlertSeverity[] = ['CRITICAL', 'WARNING', 'LOW'];

export const isValidAlertSeverity = (value: string): value is AlertSeverity => {
  return (AlertSeverities as readonly string[]).includes(value);
};

export const createAlertSeverity = (value: string): AlertSeverity => {
  if (!isValidAlertSeverity(value)) {
    throw new Error(`Invalid alert severity: ${value}`);
  }
  return value;
};
