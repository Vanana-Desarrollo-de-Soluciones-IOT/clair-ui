import { ALERT_QUERY_SERVICE, AlertQueryService } from "../../domain/services/alert-query-service";
import { Inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import {
  AlertingContextAlertItem,
  AlertingContextAlertStatus,
  AlertingContextFacade,
} from "../../interfaces/acl/alerting-context-facade";

import { createGetAlertsQuery } from "../../domain/model/queries/get-alerts.query";

@Injectable({ providedIn: "root" })
export class AlertingContextFacadeImpl implements AlertingContextFacade {
  constructor(
    @Inject(ALERT_QUERY_SERVICE) private readonly alertQueryService: AlertQueryService
  ) {}

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
