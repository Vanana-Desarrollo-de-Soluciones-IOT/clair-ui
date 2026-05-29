import { AnalyticsOverviewResource } from '../resources/analytics-overview.resource';
import { AnalyticsOverviewSnapshot } from '../../../domain/model/valueobjects/analytics-overview.value-object';

export const analyticsOverviewResourceToDomain = (
  resource: AnalyticsOverviewResource,
): AnalyticsOverviewSnapshot => {
  return Object.freeze({
    core: Object.freeze({
      aqiValue: resource.core.aqiValue ?? null,
      aqiCategory: resource.core.aqiCategory ?? null,
      averageCo2: resource.core.averageCo2 ?? null,
      averagePm2_5: resource.core.averagePm2_5 ?? null,
      averageTemperature: resource.core.averageTemperature ?? null,
      averageHumidity: resource.core.averageHumidity ?? null,
      recordedAt: resource.core.recordedAt ?? null,
      organizationCount: resource.core.organizationCount ?? 0,
      spaceCount: resource.core.spaceCount ?? 0,
      deviceCount: resource.core.deviceCount ?? 0,
      dataFreshness: resource.core.dataFreshness,
    }),
    organizations: Object.freeze(
      (resource.organizations ?? []).map((org) =>
        Object.freeze({
          organizationId: org.organizationId,
          organizationName: org.organizationName,
          spaces: Object.freeze(
            (org.spaces ?? []).map((space) =>
              Object.freeze({
                spaceId: space.spaceId,
                organizationId: space.organizationId,
                spaceName: space.spaceName,
                aqiValue: space.aqiValue ?? null,
                aqiCategory: space.aqiCategory ?? null,
                recordedAt: space.recordedAt ?? null,
                deviceCount: space.deviceCount ?? 0,
                dataFreshness: space.dataFreshness,
              }),
            ),
          ),
        }),
      ),
    ),
    alerts: Object.freeze(
      (resource.alerts ?? []).map((alert) =>
        Object.freeze({
          alertId: alert.alertId,
          deviceId: alert.deviceId,
          spaceId: alert.spaceId ?? null,
          deviceName: alert.deviceName ?? null,
          spaceName: alert.spaceName ?? null,
          message: alert.message,
          severity: alert.severity,
          status: alert.status,
          occurredAt: alert.occurredAt,
        }),
      ),
    ),
    updatedAt: resource.updatedAt,
  });
};
