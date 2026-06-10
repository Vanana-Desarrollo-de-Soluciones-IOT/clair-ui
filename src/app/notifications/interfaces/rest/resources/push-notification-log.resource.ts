export interface PushNotificationLogResource {
  readonly id: string;
  readonly userId: string;
  readonly alertId: string | null;
  readonly title: string;
  readonly message: string;
  readonly status: 'SENT' | 'FAILED';
  readonly errorMessage: string | null;
  readonly createdAt: string;
}
