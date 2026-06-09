import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { AnalyticsOverviewSnapshot } from '../../domain/model/valueobjects/analytics-overview.value-object';
import { LiveTelemetry } from '../../domain/services/analytics-query-service';

export type AnalyticsContextDashboardMetrics = Readonly<{
  aqiValue: number;
  aqiCategory: string;
  co2Value: number;
  pm2_5Value: number;
  temperatureValue: number;
  humidityValue: number;
  calculatedAt: string;
}>;

export interface AnalyticsContextFacade {
  getLiveDashboardMetricsByDevice(
    deviceId: string,
  ): Observable<AnalyticsContextDashboardMetrics>;

  getOverviewDashboard(
    deviceLimitPerSpace?: number,
    alertLimit?: number,
  ): Observable<AnalyticsOverviewSnapshot>;

  streamLiveTelemetry(deviceId: string): Observable<LiveTelemetry>;
}

export const ANALYTICS_CONTEXT_FACADE = new InjectionToken<AnalyticsContextFacade>(
  'ANALYTICS_CONTEXT_FACADE',
);
