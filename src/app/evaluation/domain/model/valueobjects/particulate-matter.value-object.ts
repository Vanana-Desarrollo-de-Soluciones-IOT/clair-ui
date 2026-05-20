export type ParticulateMatter = Readonly<{
  pm1_0: number;
  pm2_5: number;
  pm10: number;
}>;

export const createParticulateMatter = (pm1_0: number, pm2_5: number, pm10: number): ParticulateMatter => {
  if (!Number.isInteger(pm1_0) || pm1_0 < 0) throw new Error('PM1.0 must be a non-negative integer');
  if (!Number.isInteger(pm2_5) || pm2_5 < 0) throw new Error('PM2.5 must be a non-negative integer');
  if (!Number.isInteger(pm10) || pm10 < 0) throw new Error('PM10 must be a non-negative integer');
  return Object.freeze({ pm1_0, pm2_5, pm10 });
};

