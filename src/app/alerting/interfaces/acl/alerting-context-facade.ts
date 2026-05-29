import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export type AlertingContextAlertStatus = 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';

export type AlertingContextAlertItem = Readonly<{
  id: string;
  message: string;
  severity: string;
  status: AlertingContextAlertStatus;
  deviceName: string | null;
  spaceName: string | null;
  occurredAt: string;
}>;

export interface AlertingContextFacade {
  getCurrentUserAlerts(
    page: number,
    size: number,
    status?: ReadonlyArray<AlertingContextAlertStatus>,
  ): Observable<ReadonlyArray<AlertingContextAlertItem>>;
}

export const ALERTING_CONTEXT_FACADE = new InjectionToken<AlertingContextFacade>(
  'ALERTING_CONTEXT_FACADE',
);
