import { Observable } from 'rxjs';
import { GetAlertsByDeviceQuery } from '../model/queries/get-alerts-by-device.query';
import { GetAlertsBySpaceQuery } from '../model/queries/get-alerts-by-space.query';
import { AlertId } from '../model/valueobjects/alert-id.value-object';
import { AlertStatus } from '../model/valueobjects/alert-status.value-object';
import { MetricType } from '../model/valueobjects/metric-type.value-object';

export type Alert = Readonly<{
  id: AlertId;
  deviceId: string;
  spaceId: string | null;
  metric: MetricType;
  metricLabel: string;
  metricUnit: string;
  thresholdValue: number;
  actualValue: number;
  message: string;
  status: AlertStatus;
  occurredAt: string;
  resolvedAt: string | null;
  createdAt: string;
}>;

export type AlertPage = Readonly<{
  content: readonly Alert[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}>;

export interface AlertQueryService {
  handleGetAlertsByDevice(query: GetAlertsByDeviceQuery): Observable<AlertPage>;
  handleGetAlertsBySpace(query: GetAlertsBySpaceQuery): Observable<AlertPage>;
}
