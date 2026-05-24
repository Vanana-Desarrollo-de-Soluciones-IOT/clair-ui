import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AirQualityQueryService, AirQualityLive } from '../../../domain/services/air-quality-query-service';
import { GetAirQualityLiveQuery } from '../../../domain/model/queries/get-air-quality-live.query';
import { GetAirQualityTrendsQuery } from '../../../domain/model/queries/get-air-quality-trends.query';
import { TrendPoint } from '../../../domain/model/valueobjects/trend-point.value-object';
import { AirQualityHttpGateway } from '../../../infrastructure/api/gateways/air-quality-http.gateway';
import { airQualityLiveResourceToDomain, trendDataPointResourceToDomain } from '../../../interfaces/rest/transform/air-quality.transform';

@Injectable({ providedIn: 'root' })
export class AirQualityQueryServiceImpl implements AirQualityQueryService {
  constructor(private readonly gateway: AirQualityHttpGateway) {}

  handleGetAirQualityLive(query: GetAirQualityLiveQuery): Observable<AirQualityLive> {
    return this.gateway.getLiveMetrics(query.deviceId).pipe(
      map(airQualityLiveResourceToDomain)
    );
  }

  handleGetAirQualityTrends(query: GetAirQualityTrendsQuery): Observable<TrendPoint[]> {
    return this.gateway.getTrendMetrics(query.deviceId, query.period).pipe(
      map((resource) => resource.dataPoints.map(trendDataPointResourceToDomain))
    );
  }
}
