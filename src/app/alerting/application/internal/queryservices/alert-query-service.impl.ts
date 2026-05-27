import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AlertQueryService, AlertPage } from '../../../domain/services/alert-query-service';
import { GetAlertsByDeviceQuery } from '../../../domain/model/queries/get-alerts-by-device.query';
import { GetAlertsBySpaceQuery } from '../../../domain/model/queries/get-alerts-by-space.query';
import { AlertHttpGateway } from '../../../infrastructure/api/gateways/alert-http.gateway';
import { alertPageResourceToDomain } from '../../../interfaces/rest/transform/alert.transform';

@Injectable({ providedIn: 'root' })
export class AlertQueryServiceImpl implements AlertQueryService {
  constructor(private readonly gateway: AlertHttpGateway) {}

  handleGetAlertsByDevice(query: GetAlertsByDeviceQuery): Observable<AlertPage> {
    return this.gateway
      .getAlertsByDevice(query.deviceId, query.page, query.size)
      .pipe(map(alertPageResourceToDomain));
  }

  handleGetAlertsBySpace(query: GetAlertsBySpaceQuery): Observable<AlertPage> {
    return this.gateway
      .getAlertsBySpace(query.spaceId, query.page, query.size)
      .pipe(map(alertPageResourceToDomain));
  }
}
