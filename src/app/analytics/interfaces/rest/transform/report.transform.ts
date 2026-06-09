import {
  AqiCategory,
  CategoryShare,
  DeviceReport,
  MetricStats,
  createCategoryShare,
  createDeviceReport,
  createMetricStats,
} from '../../../domain/model/valueobjects/report.value-object';
import {
  CategoryShareResource,
  DailyReportResource,
  MetricStatsResource,
  MonthlyReportResource,
} from '../resources/report.resource';

const VALID_CATEGORIES: ReadonlySet<string> = new Set<AqiCategory>([
  'GOOD',
  'MODERATE',
  'UNHEALTHY_FOR_SENSITIVE',
  'UNHEALTHY',
  'VERY_UNHEALTHY',
  'HAZARDOUS',
]);

const toAqiCategory = (value: string | null | undefined): AqiCategory | null =>
  value && VALID_CATEGORIES.has(value) ? (value as AqiCategory) : null;

const mapStats = (resource: MetricStatsResource | null | undefined): MetricStats =>
  createMetricStats(resource?.avg ?? null, resource?.min ?? null, resource?.max ?? null);

const mapShares = (resources: CategoryShareResource[] | null | undefined): CategoryShare[] =>
  (resources ?? [])
    .map((share) => {
      const category = toAqiCategory(share.category);
      return category ? createCategoryShare(category, share.count, share.percentage) : null;
    })
    .filter((share): share is CategoryShare => share !== null);

export const dailyReportResourceToDomain = (resource: DailyReportResource): DeviceReport =>
  createDeviceReport({
    deviceId: resource.deviceId,
    periodType: 'DAILY',
    periodLabel: resource.date,
    co2: mapStats(resource.co2),
    pm2_5: mapStats(resource.pm2_5),
    temperature: mapStats(resource.temperature),
    humidity: mapStats(resource.humidity),
    peakPm2_5: resource.peakPm2_5 ?? null,
    peakPm2_5At: resource.peakPm2_5At ?? null,
    averageAqi: resource.averageAqi ?? null,
    dominantAqiCategory: toAqiCategory(resource.dominantAqiCategory),
    categoryShares: mapShares(resource.categoryShares),
    readingCount: resource.readingCount ?? 0,
    aqiDeltaPct: resource.aqiDeltaPct ?? null,
    daysCovered: null,
  });

export const monthlyReportResourceToDomain = (resource: MonthlyReportResource): DeviceReport =>
  createDeviceReport({
    deviceId: resource.deviceId,
    periodType: 'MONTHLY',
    periodLabel: resource.month,
    co2: mapStats(resource.co2),
    pm2_5: mapStats(resource.pm2_5),
    temperature: mapStats(resource.temperature),
    humidity: mapStats(resource.humidity),
    peakPm2_5: resource.peakPm2_5 ?? null,
    peakPm2_5At: resource.peakPm2_5At ?? null,
    averageAqi: resource.averageAqi ?? null,
    dominantAqiCategory: toAqiCategory(resource.dominantAqiCategory),
    categoryShares: mapShares(resource.categoryShares),
    readingCount: resource.readingCount ?? 0,
    aqiDeltaPct: resource.aqiDeltaPct ?? null,
    daysCovered: resource.daysCovered ?? null,
  });
