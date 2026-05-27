import { Observable } from 'rxjs';
import { AlertPageResource } from '../../../interfaces/rest/resources/alert-page.resource';

export interface AlertGateway {
  getAlertsByDevice(deviceId: string, page: number, size: number): Observable<AlertPageResource>;
  getAlertsBySpace(spaceId: string, page: number, size: number): Observable<AlertPageResource>;
}
