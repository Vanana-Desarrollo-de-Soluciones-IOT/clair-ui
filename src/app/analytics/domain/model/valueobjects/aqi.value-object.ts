export type Aqi = Readonly<{
  value: number;
  category: string;
}>;

export const createAqi = (value: number, category: string): Aqi => {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error('AQI value must be a non-negative finite number');
  }
  if (!category || category.trim().length === 0) {
    throw new Error('AQI category cannot be empty');
  }
  return Object.freeze({ value, category: category.trim() });
};
