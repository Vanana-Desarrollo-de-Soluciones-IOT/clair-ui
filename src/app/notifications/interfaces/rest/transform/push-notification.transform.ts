import { PushNotificationLogPageResource } from '../resources/push-notification-log-page.resource';
import { PushNotificationLogResource } from '../resources/push-notification-log.resource';
import {
  PushNotificationLog,
  createPushNotificationLog,
} from '../../../domain/model/valueobjects/push-notification-log.value-object';
import {
  PushNotificationLogPage,
  createPushNotificationLogPage,
} from '../../../domain/model/valueobjects/push-notification-log-page.value-object';

export const pushNotificationLogResourceToDomain = (
  resource: PushNotificationLogResource,
): PushNotificationLog => {
  return createPushNotificationLog({
    id: resource.id,
    userId: resource.userId,
    alertId: resource.alertId,
    title: resource.title,
    message: resource.message,
    sent: resource.sent,
    errorMessage: resource.errorMessage,
    createdAt: resource.createdAt,
    updatedAt: resource.updatedAt,
  });
};

export const pushNotificationLogPageResourceToDomain = (
  resource: PushNotificationLogPageResource,
): PushNotificationLogPage => {
  return createPushNotificationLogPage({
    content: resource.content.map(pushNotificationLogResourceToDomain),
    totalElements: resource.totalElements,
    totalPages: resource.totalPages,
    size: resource.size,
    number: resource.number,
  });
};
