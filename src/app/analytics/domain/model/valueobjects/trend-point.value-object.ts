export type TrendPoint = Readonly<{
  timestamp: string;
  aqiValue: number;
  co2: number;
  pm2_5: number;
  temperature: number;
  humidity: number;
}>;

export const createTrendPoint = (
  timestamp: string,
  aqiValue: number,
  co2: number,
  pm2_5: number,
  temperature: number,
  humidity: number
): TrendPoint => {
  if (!timestamp || timestamp.trim().length === 0) {
    throw new Error('Timestamp cannot be empty');
  }
  if (!Number.isFinite(aqiValue)) throw new Error('aqiValue must be a finite number');
  if (!Number.isFinite(co2)) throw new Error('co2 must be a finite number');
  if (!Number.isFinite(pm2_5)) throw new Error('pm2_5 must be a finite number');
  if (!Number.isFinite(temperature)) throw new Error('temperature must be a finite number');
  if (!Number.isFinite(humidity)) throw new Error('humidity must be a finite number');

  return Object.freeze({
    timestamp: timestamp.trim(),
    aqiValue,
    co2,
    pm2_5,
    temperature,
    humidity,
  });
};
