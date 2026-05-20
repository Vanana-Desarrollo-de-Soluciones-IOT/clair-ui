export type Location = Readonly<{
  country?: string;
}>;

export const createLocation = (country?: string): Location => {
  if (country !== undefined && country.trim().length === 0) {
    throw new Error('Country must be non-empty when provided');
  }
  return Object.freeze({ country: country?.trim() });
};

