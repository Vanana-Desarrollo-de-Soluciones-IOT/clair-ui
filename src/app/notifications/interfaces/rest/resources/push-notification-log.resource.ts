export interface PushNotificationLogResource {
  readonly id: string;
  readonly userId: string;
  readonly alertId: string | null;
  readonly title: string;
  readonly message: string;
  readonly sent: boolean;
  readonly errorMessage: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}
