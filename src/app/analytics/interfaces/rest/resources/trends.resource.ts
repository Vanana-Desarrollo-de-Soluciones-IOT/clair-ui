export interface TrendDataPointResource {
  readonly timestamp: string;
  readonly aqiValue: number;
  readonly co2: number;
  readonly pm2_5: number;
  readonly temperature: number;
  readonly humidity: number;
}

export interface TrendsResource {
  readonly dataPoints: readonly TrendDataPointResource[];
}
