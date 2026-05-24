import { Observable } from 'rxjs';
import { AirQualityLiveResource } from '../../../interfaces/rest/resources/air-quality-live.resource';
import { AirQualityTrendsResource } from '../../../interfaces/rest/resources/air-quality-trends.resource';

export interface AirQualityGateway {
  getLiveMetrics(deviceId: string): Observable<AirQualityLiveResource>;
  getTrendMetrics(deviceId: string, period: string): Observable<AirQualityTrendsResource>;
}
