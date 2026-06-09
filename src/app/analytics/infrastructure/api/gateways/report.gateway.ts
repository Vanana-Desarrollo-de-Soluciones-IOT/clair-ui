import { Observable } from 'rxjs';
import { DailyReportResource, MonthlyReportResource } from '../../../interfaces/rest/resources/report.resource';

export interface ReportGateway {
  getDailyReport(deviceId: string, date?: string): Observable<DailyReportResource>;
  getMonthlyReport(deviceId: string, month?: string): Observable<MonthlyReportResource>;
}
