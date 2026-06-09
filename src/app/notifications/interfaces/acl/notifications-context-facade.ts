import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import type { PushNotificationLogPage as PushNotificationLogPageModel } from '../../domain/model/valueobjects/push-notification-log-page.value-object';
export type { PushNotificationLog } from '../../domain/model/valueobjects/push-notification-log.value-object';
export type { PushNotificationLogPage } from '../../domain/model/valueobjects/push-notification-log-page.value-object';

export interface NotificationsContextFacade {
  initOneSignal(): void;
  loginUser(userId: string): void;
  logoutUser(): void;
  requestPermission(): void;
  getPushNotifications(page?: number): Observable<PushNotificationLogPageModel>;
}

export const NOTIFICATIONS_CONTEXT_FACADE = new InjectionToken<NotificationsContextFacade>(
  'NOTIFICATIONS_CONTEXT_FACADE',
);
