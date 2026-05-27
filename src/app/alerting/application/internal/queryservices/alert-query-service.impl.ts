import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AlertQueryService, AlertPage, DailyAlertCount } from '../../../domain/services/alert-query-service';
import { GetAlertsByDeviceQuery } from '../../../domain/model/queries/get-alerts-by-device.query';
import { GetAlertsBySpaceQuery } from '../../../domain/model/queries/get-alerts-by-space.query';
import { AlertStatus } from '../../../domain/model/valueobjects/alert-status.value-object';
import { AlertHttpGateway } from '../../../infrastructure/api/gateways/alert-http.gateway';
import { alertPageResourceToDomain, dailyAlertSummaryResourceToDomain } from '../../../interfaces/rest/transform/alert.transform';

@Injectable({ providedIn: 'root' })
export class AlertQueryServiceImpl implements AlertQueryService {
  constructor(private readonly gateway: AlertHttpGateway) {}

  handleGetAlertsByDevice(query: GetAlertsByDeviceQuery, status?: AlertStatus[]): Observable<AlertPage> {
    return this.gateway
      .getAlertsByDevice(query.deviceId, query.page, query.size, status)
      .pipe(map(alertPageResourceToDomain));
  }

  handleGetAlertsBySpace(query: GetAlertsBySpaceQuery, status?: AlertStatus[]): Observable<AlertPage> {
    return this.gateway
      .getAlertsBySpace(query.spaceId, query.page, query.size, status)
      .pipe(map(alertPageResourceToDomain));
  }

  handleGetDailySummaryBySpace(spaceId: string, days: number): Observable<DailyAlertCount[]> {
    return this.gateway
      .getDailyAlertSummary(spaceId, days)
      .pipe(map((resources) => resources.map(dailyAlertSummaryResourceToDomain)));
  }
}
