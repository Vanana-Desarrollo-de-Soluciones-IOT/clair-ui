export type AqiCategory =
  | 'GOOD'
  | 'MODERATE'
  | 'UNHEALTHY_FOR_SENSITIVE'
  | 'UNHEALTHY'
  | 'VERY_UNHEALTHY'
  | 'HAZARDOUS';

export type ReportPeriodType = 'DAILY' | 'MONTHLY';

export type MetricStats = Readonly<{
  avg: number | null;
  min: number | null;
  max: number | null;
}>;

export const createMetricStats = (
  avg: number | null,
  min: number | null,
  max: number | null
): MetricStats => Object.freeze({ avg, min, max });

export type CategoryShare = Readonly<{
  category: AqiCategory;
  count: number;
  percentage: number;
}>;

export const createCategoryShare = (
  category: AqiCategory,
  count: number,
  percentage: number
): CategoryShare => Object.freeze({ category, count, percentage });

/**
 * Aggregate air-quality report for a single device over one calendar period
 * (a day or a month). Mirrors the `analytics` ReportController payloads, with
 * the daily/monthly identity normalised into `periodType` + `periodLabel`.
 */
export type DeviceReport = Readonly<{
  deviceId: string;
  periodType: ReportPeriodType;
  /** Calendar date (`YYYY-MM-DD`) for daily, first day of month for monthly. */
  periodLabel: string;
  co2: MetricStats;
  pm2_5: MetricStats;
  temperature: MetricStats;
  humidity: MetricStats;
  peakPm2_5: number | null;
  peakPm2_5At: string | null;
  averageAqi: number | null;
  dominantAqiCategory: AqiCategory | null;
  categoryShares: CategoryShare[];
  readingCount: number;
  aqiDeltaPct: number | null;
  /** Monthly reports only — number of days in the month that had data. */
  daysCovered: number | null;
}>;

export const createDeviceReport = (report: {
  deviceId: string;
  periodType: ReportPeriodType;
  periodLabel: string;
  co2: MetricStats;
  pm2_5: MetricStats;
  temperature: MetricStats;
  humidity: MetricStats;
  peakPm2_5: number | null;
  peakPm2_5At: string | null;
  averageAqi: number | null;
  dominantAqiCategory: AqiCategory | null;
  categoryShares: CategoryShare[];
  readingCount: number;
  aqiDeltaPct: number | null;
  daysCovered: number | null;
}): DeviceReport => Object.freeze({ ...report, categoryShares: Object.freeze([...report.categoryShares]) as unknown as CategoryShare[] });
