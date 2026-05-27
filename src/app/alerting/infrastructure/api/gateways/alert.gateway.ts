import { Observable } from 'rxjs';
import { AlertPageResource } from '../../../interfaces/rest/resources/alert-page.resource';
import { DailyAlertSummaryResource } from '../../../interfaces/rest/resources/daily-alert-summary.resource';

export interface AlertGateway {
  getAlertsByDevice(deviceId: string, page: number, size: number, status?: string[]): Observable<AlertPageResource>;
  getAlertsBySpace(spaceId: string, page: number, size: number, status?: string[]): Observable<AlertPageResource>;
  getDailyAlertSummary(spaceId: string, days: number): Observable<DailyAlertSummaryResource[]>;
}
