import { Observable } from 'rxjs';
import { GetDeviceStatusByIdQuery } from '../model/queries/get-device-status-by-id.query';
import { DeviceId } from '../model/valueobjects/device-id.value-object';
import { DeviceStatus } from '../model/valueobjects/device-status.value-object';

export type DeviceStatusSnapshot = Readonly<{
  deviceId: DeviceId;
  status: DeviceStatus;
  lastSeenAt: string | null;
}>;

export interface DeviceStatusQueryService {
  handleGetDeviceStatusById(query: GetDeviceStatusByIdQuery): Observable<DeviceStatusSnapshot | null>;
}
