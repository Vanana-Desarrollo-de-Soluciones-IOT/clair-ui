import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../../../api.config';
import { NotificationGateway } from './notification.gateway';
import { PushNotificationLogPageResource } from '../../../interfaces/rest/resources/push-notification-log-page.resource';

@Injectable({ providedIn: 'root' })
export class NotificationHttpGateway implements NotificationGateway {
  private readonly baseUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.notifications;

  constructor(private readonly http: HttpClient) {}

  getPushNotifications(page: number): Observable<PushNotificationLogPageResource> {
    const params = new HttpParams().set('page', String(page));
    return this.http.get<PushNotificationLogPageResource>(`${this.baseUrl}/push`, { params });
  }
}
