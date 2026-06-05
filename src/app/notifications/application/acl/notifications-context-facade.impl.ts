import { Inject, Injectable } from '@angular/core';
import { OneSignal } from 'onesignal-ngx';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { createGetPushNotificationsQuery } from '../../domain/model/queries/get-push-notifications.query';
import {
  PushNotificationLogPage,
} from '../../domain/model/valueobjects/push-notification-log-page.value-object';
import {
  NOTIFICATION_QUERY_SERVICE,
  NotificationQueryService,
} from '../../domain/services/notification-query-service';
import { NotificationsContextFacade } from '../../interfaces/acl/notifications-context-facade';

@Injectable({ providedIn: 'root' })
export class NotificationsContextFacadeImpl implements NotificationsContextFacade {
  constructor(
    @Inject(NOTIFICATION_QUERY_SERVICE)
    private readonly notificationQueryService: NotificationQueryService,
    private readonly oneSignal: OneSignal,
  ) {}

  getPushNotifications(page: number = 0): Observable<PushNotificationLogPage> {
    const query = createGetPushNotificationsQuery(page);
    return this.notificationQueryService.handleGetPushNotifications(query);
  }

  initOneSignal(): void {
    console.log('[NotificationsContextFacade] Initializing OneSignal...');

    this.oneSignal
      .init({
        appId: environment.onesignalAppId,
        safari_web_id: environment.safariWebId,
        notifyButton: {
          enable: false,
        },
        allowLocalhostAsSecureOrigin: true,
      } as any)
      .then(() => {
        console.log('[NotificationsContextFacade] OneSignal successfully initialized.');

        this.oneSignal.Notifications.addEventListener('click', (event) => {
          console.log('[NotificationsContextFacade] Notification clicked:', event);
        });
      })
      .catch((err) => {
        console.error('[NotificationsContextFacade] Failed to initialize OneSignal:', err);
      });
  }

  loginUser(userId: string): void {
    console.log('[NotificationsContextFacade] Logging in user to OneSignal:', userId);

    this.oneSignal
      .login(userId)
      .then(() => {
        console.log('[NotificationsContextFacade] User associated successfully with OneSignal:', userId);
      })
      .catch((err) => {
        console.error('[NotificationsContextFacade] Error associating user with OneSignal:', err);
      });
  }

  logoutUser(): void {
    console.log('[NotificationsContextFacade] Logging out user from OneSignal...');

    this.oneSignal
      .logout()
      .then(() => {
        console.log('[NotificationsContextFacade] OneSignal logout completed.');
      })
      .catch((err) => {
        console.error('[NotificationsContextFacade] Error logging out from OneSignal:', err);
      });
  }

  requestPermission(): void {
    console.log('[NotificationsContextFacade] Requesting notification permission...');

    this.oneSignal.Notifications.requestPermission().then((permission) => {
      console.log('[NotificationsContextFacade] Notification permission status:', permission);
    }).catch((err) => {
      console.error('[NotificationsContextFacade] Error requesting permission:', err);
    });
  }
}
