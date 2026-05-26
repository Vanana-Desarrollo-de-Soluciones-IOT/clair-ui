import { DashboardMetrics } from '../../../domain/services/analytics-query-service';
import { DashboardMetricsResource } from '../resources/dashboard-metrics.resource';
import { TrendPoint, createTrendPoint } from '../../../domain/model/valueobjects/trend-point.value-object';
import { TrendDataPointResource } from '../resources/trends.resource';
import { createAqi } from '../../../domain/model/valueobjects/aqi.value-object';
import { createMetricDelta } from '../../../domain/model/valueobjects/metric-delta.value-object';

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
