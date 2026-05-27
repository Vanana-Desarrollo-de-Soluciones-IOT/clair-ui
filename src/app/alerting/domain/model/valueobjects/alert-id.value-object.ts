export type AlertId = Readonly<{
  value: string;
}>;

export const createAlertId = (value: string): AlertId => {
  if (!value || value.trim().length === 0) {
    throw new Error('Alert ID is required');
  }
  return Object.freeze({ value: value.trim() });
};
