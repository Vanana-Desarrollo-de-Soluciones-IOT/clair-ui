import { AlertResponseResource } from './alert-response.resource';

export interface AlertPageResource {
  readonly content: AlertResponseResource[];
  readonly totalElements: number;
  readonly totalPages: number;
  readonly size: number;
  readonly number: number;
}
