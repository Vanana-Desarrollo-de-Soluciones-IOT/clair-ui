import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OneSignal } from 'onesignal-ngx';
import { environment } from '../../../environments/environment';

export interface PushNotificationLog {
  id: string;
  userId: string;
  alertId: string | null;
  title: string;
  message: string;
  sent: boolean;
  errorMessage: string | null;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

export interface PushNotificationLogPage {
  content: PushNotificationLog[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(
    private readonly oneSignal: OneSignal,
    private readonly http: HttpClient
  ) {}

  /**
   * Obtiene la lista paginada de notificaciones push del usuario autenticado.
   * @param page Número de página (0-indexed)
   */
  getPushNotifications(page: number = 0): Observable<PushNotificationLogPage> {
    const params = new HttpParams().set('page', page.toString());
    return this.http.get<PushNotificationLogPage>('/api/v1/notifications/push', { params });
  }

  /**
   * Inicializa el SDK de OneSignal usando las credenciales del entorno.
   */
  initOneSignal(): void {
    console.log('[NotificationService] Initializing OneSignal...');
    this.oneSignal.init({
      appId: environment.onesignalAppId,
      safari_web_id: environment.safariWebId,
      notifyButton: {
        enable: false,
      },
      allowLocalhostAsSecureOrigin: true,
    } as any).then(() => {
      console.log('[NotificationService] OneSignal successfully initialized.');

      // Registrar listener para clics en notificaciones
      this.oneSignal.Notifications.addEventListener('click', (event) => {
        console.log('[NotificationService] Notification clicked:', event);
      });
    }).catch(err => {
      console.error('[NotificationService] Failed to initialize OneSignal:', err);
    });
  }

  /**
   * Asocia al usuario autenticado con OneSignal usando su external_user_id.
   * @param userId UUID del usuario autenticado
   */
  loginUser(userId: string): void {
    console.log('[NotificationService] Logging in user to OneSignal:', userId);
    this.oneSignal.login(userId)
      .then(() => {
        console.log('[NotificationService] User associated successfully with OneSignal:', userId);
      })
      .catch(err => {
        console.error('[NotificationService] Error associating user with OneSignal:', err);
      });
  }

  /**
   * Desvincula al usuario actual de OneSignal al cerrar sesión.
   */
  logoutUser(): void {
    console.log('[NotificationService] Logging out user from OneSignal...');
    this.oneSignal.logout()
      .then(() => {
        console.log('[NotificationService] OneSignal logout completed.');
      })
      .catch(err => {
        console.error('[NotificationService] Error logging out from OneSignal:', err);
      });
  }

  /**
   * Solicita permisos de notificación al usuario.
   */
  requestPermission(): void {
    console.log('[NotificationService] Requesting notification permission...');
    this.oneSignal.Notifications.requestPermission()
      .then((permission) => {
        console.log('[NotificationService] Notification permission status:', permission);
      })
      .catch(err => {
        console.error('[NotificationService] Error requesting permission:', err);
      });
  }
}
