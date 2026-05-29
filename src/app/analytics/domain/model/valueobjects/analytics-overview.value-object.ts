export type AnalyticsOverviewFreshness = 'LIVE' | 'STALE' | 'NO_DATA';

export type AnalyticsOverviewCoreMetrics = Readonly<{
  aqiValue: number | null;
  aqiCategory: string | null;
  averageCo2: number | null;
  averagePm2_5: number | null;
  averageTemperature: number | null;
  averageHumidity: number | null;
  recordedAt: string | null;
  organizationCount: number;
  spaceCount: number;
  deviceCount: number;
  dataFreshness: AnalyticsOverviewFreshness;
}>;

export type AnalyticsOverviewSpace = Readonly<{
  spaceId: string;
  organizationId: string;
  spaceName: string;
  aqiValue: number | null;
  aqiCategory: string | null;
  recordedAt: string | null;
  deviceCount: number;
  dataFreshness: AnalyticsOverviewFreshness;
}>;

export type AnalyticsOverviewOrganization = Readonly<{
  organizationId: string;
  organizationName: string;
  spaces: ReadonlyArray<AnalyticsOverviewSpace>;
}>;

export type AnalyticsOverviewAlert = Readonly<{
  alertId: string;
  deviceId: string;
  spaceId: string | null;
  deviceName: string | null;
  spaceName: string | null;
  message: string;
  severity: string;
  status: string;
  occurredAt: string;
}>;

export type AnalyticsOverviewSnapshot = Readonly<{
  core: AnalyticsOverviewCoreMetrics;
  organizations: ReadonlyArray<AnalyticsOverviewOrganization>;
  alerts: ReadonlyArray<AnalyticsOverviewAlert>;
  updatedAt: string;
}>;

