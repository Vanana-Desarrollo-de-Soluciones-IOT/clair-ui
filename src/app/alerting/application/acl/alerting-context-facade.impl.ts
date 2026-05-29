import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  AlertingContextAlertItem,
  AlertingContextAlertStatus,
  AlertingContextFacade,
} from '../../interfaces/acl/alerting-context-facade';
import { AlertQueryServiceImpl } from '../internal/queryservices/alert-query-service.impl';
import { createGetAlertsQuery } from '../../domain/model/queries/get-alerts.query';

@Injectable({ providedIn: 'root' })
export class AlertingContextFacadeImpl implements AlertingContextFacade {
  constructor(private readonly alertQueryService: AlertQueryServiceImpl) {}

  getCurrentUserAlerts(
    page: number,
    size: number,
    status?: ReadonlyArray<AlertingContextAlertStatus>,
  ): Observable<ReadonlyArray<AlertingContextAlertItem>> {
    const query = createGetAlertsQuery(page, size);
    const statusFilter = status ? [...status] : undefined;

    return this.alertQueryService.handleGetAlerts(query, statusFilter).pipe(
      map((alertPage) =>
        alertPage.content.map((alert) => ({
          id: alert.id.value,
          message: alert.message,
          severity: alert.severity,
          status: alert.status,
          deviceName: alert.deviceName,
          spaceName: alert.spaceName,
          occurredAt: alert.occurredAt,
        })),
      ),
    );
  }
}
