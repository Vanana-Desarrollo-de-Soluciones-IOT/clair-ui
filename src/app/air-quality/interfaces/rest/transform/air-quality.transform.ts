import { AirQualityLive } from '../../../domain/services/air-quality-query-service';
import { AirQualityLiveResource } from '../resources/air-quality-live.resource';
import { TrendPoint, createTrendPoint } from '../../../domain/model/valueobjects/trend-point.value-object';
import { TrendDataPointResource } from '../resources/air-quality-trends.resource';
import { createAqi } from '../../../domain/model/valueobjects/aqi.value-object';
import { createMetricDelta } from '../../../domain/model/valueobjects/metric-delta.value-object';

export const airQualityLiveResourceToDomain = (resource: AirQualityLiveResource): AirQualityLive => {
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
