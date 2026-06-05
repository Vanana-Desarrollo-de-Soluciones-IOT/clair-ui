import { Inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  createGetPushNotificationsQuery,
  GetPushNotificationsQuery,
} from '../../../domain/model/queries/get-push-notifications.query';
import { PushNotificationLogPage } from '../../../domain/model/valueobjects/push-notification-log-page.value-object';
import { NotificationQueryService } from '../../../domain/services/notification-query-service';
import {
  NOTIFICATION_GATEWAY,
  NotificationGateway,
} from '../../../infrastructure/api/gateways/notification.gateway';
import { pushNotificationLogPageResourceToDomain } from '../../../interfaces/rest/transform/push-notification.transform';

@Injectable({ providedIn: 'root' })
export class NotificationQueryServiceImpl implements NotificationQueryService {
  constructor(
    @Inject(NOTIFICATION_GATEWAY) private readonly notificationGateway: NotificationGateway,
  ) {}

  handleGetPushNotifications(query: GetPushNotificationsQuery): Observable<PushNotificationLogPage> {
    const normalizedQuery = createGetPushNotificationsQuery(query.page);

    return this.notificationGateway.getPushNotifications(normalizedQuery.page).pipe(
      map((resource) => pushNotificationLogPageResourceToDomain(resource)),
    );
  }
}
