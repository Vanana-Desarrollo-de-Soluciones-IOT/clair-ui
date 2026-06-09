export type PushNotificationLog = Readonly<{
  id: string;
  userId: string;
  alertId: string | null;
  title: string;
  message: string;
  sent: boolean;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}>;

const ensureNonEmptyString = (value: string, fieldName: string): void => {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${fieldName} is required.`);
  }
};

export const createPushNotificationLog = (log: PushNotificationLog): PushNotificationLog => {
  ensureNonEmptyString(log.id, 'id');
  ensureNonEmptyString(log.userId, 'userId');
  ensureNonEmptyString(log.title, 'title');
  ensureNonEmptyString(log.message, 'message');
  ensureNonEmptyString(log.createdAt, 'createdAt');
  ensureNonEmptyString(log.updatedAt, 'updatedAt');

  return Object.freeze({
    ...log,
  });
};
