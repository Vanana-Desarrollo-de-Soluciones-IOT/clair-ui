export interface AlertResponseResource {
  readonly id: string;
  readonly deviceId: string;
  readonly spaceId: string | null;
  readonly metric: string;
  readonly metricLabel: string;
  readonly metricUnit: string;
  readonly thresholdValue: number;
  readonly actualValue: number;
  readonly message: string;
  readonly status: string;
  readonly occurredAt: string;
  readonly resolvedAt: string | null;
  readonly createdAt: string;
}
