import { environment } from '../environments/environment';

export const API_CONFIG = {
  baseUrl: environment.apiBaseUrl,
  endpoints: {
    iam: '/v1/auth',
    subscriptions: '/v1/subscriptions',
    organizations: '/v1/organizations',
    spaces: '/v1/spaces',
    devices: '/v1/devices'
  }
} as const;
