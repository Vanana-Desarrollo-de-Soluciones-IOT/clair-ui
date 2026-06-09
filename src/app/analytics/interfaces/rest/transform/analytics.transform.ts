import { DashboardMetrics } from '../../../domain/services/analytics-query-service';
import { DashboardMetricsResource } from '../resources/dashboard-metrics.resource';
import { TrendPoint, createTrendPoint } from '../../../domain/model/valueobjects/trend-point.value-object';
import { TrendDataPointResource } from '../resources/trends.resource';
import { createAqi } from '../../../domain/model/valueobjects/aqi.value-object';
import { createMetricDelta } from '../../../domain/model/valueobjects/metric-delta.value-object';
import { AnalyticsOverviewSnapshot } from '../../../domain/model/valueobjects/analytics-overview.value-object';
import { OrganizationAqiItem } from '../../components/organization-card/organization-card.component';
import { AlertsCardItem } from '../../components/alerts-card/alerts-card.component';

export type OverviewMeasurements = Readonly<{
  aqi: {
    value: number;
    category: string;
  } | null;
  co2: number | null;
  temperature: number | null;
  humidity: number | null;
  pm2_5: number | null;
  co2DeltaLabel: string | null;
  pm2_5DeltaLabel: string | null;
  temperatureDeltaLabel: string | null;
  humidityDeltaLabel: string | null;
  recordedAt: string | null;
  deviceCount: number | null;
  organizations: OrganizationAqiItem[];
  alerts: AlertsCardItem[];
}>;

export const dashboardMetricsResourceToDomain = (resource: DashboardMetricsResource): DashboardMetrics => {
  return {
    aqi: createAqi(resource.aqiValue, resource.aqiCategory),
    co2: createMetricDelta(resource.averageCo2, resource.co2DeltaPercentage),
    pm2_5: createMetricDelta(resource.averagePm2_5, resource.pm2_5DeltaPercentage),
    temperature: createMetricDelta(resource.averageTemperature, resource.temperatureDeltaPercentage),
    humidity: createMetricDelta(resource.averageHumidity, resource.humidityDeltaPercentage),
    calculatedAt: resource.calculatedAt,
  };
};

export const trendDataPointResourceToDomain = (resource: TrendDataPointResource): TrendPoint => {
  return createTrendPoint(
    resource.timestamp,
    resource.aqiValue,
    resource.co2,
    resource.pm2_5,
    resource.temperature,
    resource.humidity
  );
};

const formatDelta = (delta: number | null | undefined): string | null => {
  if (delta === null || delta === undefined || !Number.isFinite(delta)) return null;
  const rounded = Math.round(delta * 10) / 10;
  const sign = rounded > 0 ? '+' : '';
  return `${sign}${rounded}%`;
};

export const analyticsOverviewSnapshotToOverviewMeasurements = (
  snapshot: AnalyticsOverviewSnapshot | null
): OverviewMeasurements | null => {
  if (!snapshot) return null;

  const organizations: OrganizationAqiItem[] = (snapshot.organizations ?? []).flatMap((org) =>
    (org.spaces ?? []).map((space) => ({
      organizationName: org.organizationName,
      spaceName: space.spaceName,
      aqiValue: space.aqiValue ?? null,
      aqiCategory: space.aqiCategory ?? null,
    }))
  );

  const alerts: AlertsCardItem[] = (snapshot.alerts ?? []).map((a) => ({
    id: a.alertId,
    message: a.message,
    severity: a.severity,
    status: a.status,
    deviceName: a.deviceName ?? null,
    spaceName: a.spaceName ?? null,
    occurredAt: a.occurredAt,
  }));

  return {
    aqi:
      snapshot.core.aqiValue === null || snapshot.core.aqiCategory === null
        ? null
        : { value: snapshot.core.aqiValue, category: snapshot.core.aqiCategory },
    co2: snapshot.core.averageCo2 ?? null,
    temperature: snapshot.core.averageTemperature ?? null,
    humidity: snapshot.core.averageHumidity ?? null,
    pm2_5: snapshot.core.averagePm2_5 ?? null,
    co2DeltaLabel: formatDelta(snapshot.core.co2DeltaPercentage),
    pm2_5DeltaLabel: formatDelta(snapshot.core.pm2_5DeltaPercentage),
    temperatureDeltaLabel: formatDelta(snapshot.core.temperatureDeltaPercentage),
    humidityDeltaLabel: formatDelta(snapshot.core.humidityDeltaPercentage),
    recordedAt: snapshot.core.recordedAt ?? snapshot.updatedAt ?? null,
    deviceCount: snapshot.core.deviceCount ?? null,
    organizations,
    alerts,
  };
};
