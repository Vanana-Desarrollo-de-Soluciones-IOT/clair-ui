export interface MetricStatsResource {
  readonly avg: number | null;
  readonly min: number | null;
  readonly max: number | null;
}

export interface CategoryShareResource {
  readonly category: string;
  readonly count: number;
  readonly percentage: number;
}

export interface DailyReportResource {
  readonly deviceId: string;
  readonly date: string;
  readonly co2: MetricStatsResource;
  readonly pm2_5: MetricStatsResource;
  readonly temperature: MetricStatsResource;
  readonly humidity: MetricStatsResource;
  readonly peakPm2_5: number | null;
  readonly peakPm2_5At: string | null;
  readonly averageAqi: number | null;
  readonly dominantAqiCategory: string | null;
  readonly categoryShares: CategoryShareResource[];
  readonly readingCount: number;
  readonly aqiDeltaPct: number | null;
}

export interface MonthlyReportResource extends Omit<DailyReportResource, 'date'> {
  readonly month: string;
  readonly daysCovered: number;
}
