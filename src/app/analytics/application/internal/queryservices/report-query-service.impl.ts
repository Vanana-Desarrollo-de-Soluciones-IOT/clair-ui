import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ReportQueryService } from '../../../domain/services/report-query-service';
import { GetDailyReportQuery } from '../../../domain/model/queries/get-daily-report.query';
import { GetMonthlyReportQuery } from '../../../domain/model/queries/get-monthly-report.query';
import { DeviceReport } from '../../../domain/model/valueobjects/report.value-object';
import { ReportHttpGateway } from '../../../infrastructure/api/gateways/report-http.gateway';
import {
  dailyReportResourceToDomain,
  monthlyReportResourceToDomain,
} from '../../../interfaces/rest/transform/report.transform';

@Injectable({ providedIn: 'root' })
export class ReportQueryServiceImpl implements ReportQueryService {
  constructor(private readonly gateway: ReportHttpGateway) {}

  handleGetDailyReport(query: GetDailyReportQuery): Observable<DeviceReport | null> {
    return this.gateway.getDailyReport(query.deviceId, query.date).pipe(
      map(dailyReportResourceToDomain),
      catchError(notFoundToNull)
    );
  }

  handleGetMonthlyReport(query: GetMonthlyReportQuery): Observable<DeviceReport | null> {
    return this.gateway.getMonthlyReport(query.deviceId, query.month).pipe(
      map(monthlyReportResourceToDomain),
      catchError(notFoundToNull)
    );
  }
}

/** A 404 means "no report rolled up for this period" — map it to an empty state. */
const notFoundToNull = (error: unknown): Observable<DeviceReport | null> => {
  if (error instanceof HttpErrorResponse && error.status === 404) {
    return of(null);
  }
  return throwError(() => error);
};
