export type AnalyticsOverviewResource = Readonly<{
  core: AnalyticsOverviewCoreMetricsResource;
  organizations: ReadonlyArray<AnalyticsOverviewOrganizationResource>;
  alerts: ReadonlyArray<AnalyticsOverviewAlertResource>;
  updatedAt: string;
}>;

export type AnalyticsOverviewCoreMetricsResource = Readonly<{
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
  dataFreshness: 'LIVE' | 'STALE' | 'NO_DATA';
}>;

export type AnalyticsOverviewOrganizationResource = Readonly<{
  organizationId: string;
  organizationName: string;
  spaces: ReadonlyArray<AnalyticsOverviewSpaceResource>;
}>;

export type AnalyticsOverviewSpaceResource = Readonly<{
  spaceId: string;
  organizationId: string;
  spaceName: string;
  aqiValue: number | null;
  aqiCategory: string | null;
  recordedAt: string | null;
  deviceCount: number;
  dataFreshness: 'LIVE' | 'STALE' | 'NO_DATA';
}>;

export type AnalyticsOverviewAlertResource = Readonly<{
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

