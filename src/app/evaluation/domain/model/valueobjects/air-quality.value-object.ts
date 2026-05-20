export type AirQuality = Readonly<{
  co2: number;
  temperature: number;
  humidity: number;
}>;

export const createAirQuality = (co2: number, temperature: number, humidity: number): AirQuality => {
  if (!Number.isFinite(co2)) throw new Error('CO2 must be a finite number');
  if (!Number.isFinite(temperature)) throw new Error('Temperature must be a finite number');
  if (!Number.isFinite(humidity)) throw new Error('Humidity must be a finite number');
  return Object.freeze({ co2, temperature, humidity });
};

