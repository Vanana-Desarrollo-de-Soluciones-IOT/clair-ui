export interface DeviceStatusResource {
  readonly deviceId: string;
  readonly status: string;
  readonly lastSeenAt: string | null;
}

