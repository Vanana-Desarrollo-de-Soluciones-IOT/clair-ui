import { PushNotificationLogResource } from './push-notification-log.resource';

export interface PushNotificationLogPageResource {
  readonly content: ReadonlyArray<PushNotificationLogResource>;
  readonly totalElements: number;
  readonly totalPages: number;
  readonly size: number;
  readonly number: number;
}
