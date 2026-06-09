export type AlertStatus = 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';

export const AlertStatus_ACTIVE: AlertStatus = 'ACTIVE';
export const AlertStatus_ACKNOWLEDGED: AlertStatus = 'ACKNOWLEDGED';
export const AlertStatus_RESOLVED: AlertStatus = 'RESOLVED';

export const AlertStatuses: readonly AlertStatus[] = ['ACTIVE', 'ACKNOWLEDGED', 'RESOLVED'];

export const isValidAlertStatus = (value: string): value is AlertStatus => {
  return (AlertStatuses as readonly string[]).includes(value);
};

export const createAlertStatus = (value: string): AlertStatus => {
  if (!isValidAlertStatus(value)) {
    throw new Error(`Invalid alert status: ${value}`);
  }
  return value;
};
