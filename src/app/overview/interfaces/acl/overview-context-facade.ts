import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export type OverviewOrganizationAqi = Readonly<{
  organizationName: string;
  spaceName: string;
  aqiValue: number | null;
}>;

export type OverviewMeasurements = Readonly<{
  aqi: {
    value: number;
    category: string;
  } | null;
  co2: number | null;
  temperature: number | null;
  humidity: number | null;
  pm2_5: number | null;
  recordedAt: string | null;
  organizations: OverviewOrganizationAqi[];
}>;

export interface OverviewContextFacade {
  getLatestOverviewMeasurements(): Observable<OverviewMeasurements | null>;
}

export const OVERVIEW_CONTEXT_FACADE = new InjectionToken<OverviewContextFacade>(
  'OVERVIEW_CONTEXT_FACADE',
);
