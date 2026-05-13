import { environment } from '../environments/environment';

export const API_CONFIG = {
  baseUrl: environment.apiBaseUrl,
  endpoints: {
    iam: '/api/v1/auth'
  }
} as const;
