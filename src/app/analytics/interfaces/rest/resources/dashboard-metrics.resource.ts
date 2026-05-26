export interface DashboardMetricsResource {
  readonly aqiValue: number;
  readonly aqiCategory: string;
  readonly averageCo2: number;
  readonly averagePm2_5: number;
  readonly averageTemperature: number;
  readonly averageHumidity: number;
  readonly co2DeltaPercentage: number | null;
  readonly pm2_5DeltaPercentage: number | null;
  readonly temperatureDeltaPercentage: number | null;
  readonly humidityDeltaPercentage: number | null;
  readonly calculatedAt: string;
}
