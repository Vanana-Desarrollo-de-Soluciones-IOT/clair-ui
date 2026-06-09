import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { GetDailyReportQuery } from '../model/queries/get-daily-report.query';
import { GetMonthlyReportQuery } from '../model/queries/get-monthly-report.query';
import { DeviceReport } from '../model/valueobjects/report.value-object';

/**
 * Reads pre-aggregated daily / monthly air-quality reports for a device.
 * A `null` result means the API returned `404` (no report rolled up yet for
 * that period) — treat it as an empty state, not an error. Other failures
 * (e.g. `403` for ownership / premium) are surfaced as errors.
 */
export interface ReportQueryService {
  handleGetDailyReport(query: GetDailyReportQuery): Observable<DeviceReport | null>;
  handleGetMonthlyReport(query: GetMonthlyReportQuery): Observable<DeviceReport | null>;
}

export const REPORT_QUERY_SERVICE = new InjectionToken<ReportQueryService>('ReportQueryService');
