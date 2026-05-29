import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

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
}

export const ANALYTICS_CONTEXT_FACADE = new InjectionToken<AnalyticsContextFacade>(
  'ANALYTICS_CONTEXT_FACADE',
);
