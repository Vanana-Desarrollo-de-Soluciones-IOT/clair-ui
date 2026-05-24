export interface AirQualityLiveResource {
  readonly aqiValue: number;
  readonly aqiCategory: string;
  readonly averageCo2: number;
  readonly averagePm2_5: number;
  readonly averageTemperature: number;
  readonly averageHumidity: number;
  readonly co2DeltaPercentage: number;
  readonly pm2_5DeltaPercentage: number;
  readonly temperatureDeltaPercentage: number;
  readonly humidityDeltaPercentage: number;
  readonly calculatedAt: string;
}
