import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { PushNotificationLogPageResource } from '../../../interfaces/rest/resources/push-notification-log-page.resource';

export interface NotificationGateway {
  getPushNotifications(page: number): Observable<PushNotificationLogPageResource>;
}

export const NOTIFICATION_GATEWAY = new InjectionToken<NotificationGateway>(
  'NOTIFICATION_GATEWAY',
);
