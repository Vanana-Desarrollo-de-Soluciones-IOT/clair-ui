import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { GetPushNotificationsQuery } from '../model/queries/get-push-notifications.query';
import { PushNotificationLogPage } from '../model/valueobjects/push-notification-log-page.value-object';

export interface NotificationQueryService {
  handleGetPushNotifications(
    query: GetPushNotificationsQuery,
  ): Observable<PushNotificationLogPage>;
}

export const NOTIFICATION_QUERY_SERVICE = new InjectionToken<NotificationQueryService>(
  'NOTIFICATION_QUERY_SERVICE',
);
