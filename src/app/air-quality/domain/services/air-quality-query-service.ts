import { Observable } from 'rxjs';
import { GetAirQualityLiveQuery } from '../model/queries/get-air-quality-live.query';
import { GetAirQualityTrendsQuery } from '../model/queries/get-air-quality-trends.query';
import { Aqi } from '../model/valueobjects/aqi.value-object';
import { MetricDelta } from '../model/valueobjects/metric-delta.value-object';
import { TrendPoint } from '../model/valueobjects/trend-point.value-object';

export type AirQualityLive = Readonly<{
  aqi: Aqi;
  co2: MetricDelta;
  pm2_5: MetricDelta;
  temperature: MetricDelta;
  humidity: MetricDelta;
  calculatedAt: string;
}>;

export interface AirQualityQueryService {
  handleGetAirQualityLive(query: GetAirQualityLiveQuery): Observable<AirQualityLive>;
  handleGetAirQualityTrends(query: GetAirQualityTrendsQuery): Observable<TrendPoint[]>;
}
