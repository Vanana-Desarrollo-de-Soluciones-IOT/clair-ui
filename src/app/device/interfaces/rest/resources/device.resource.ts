import { DeviceThresholdResource } from "./device-threshold.resource";

export interface DeviceResource {
  readonly id: string;
  readonly serialNumber: string;
  readonly name: string;
  readonly status: string;
  readonly spaceId: string | null;
  readonly ownerUserId: string | null;
  readonly configuration: Record<string, string>;
  readonly thresholds: DeviceThresholdResource[];
  readonly hardwareId: string;
  readonly deviceType: string;
  readonly activatedAt: string | null;
  readonly lastSeenAt: string | null;
  readonly createdAt: string | null;
  readonly updatedAt: string | null;
}

export interface DevicePageResource {
  readonly content: DeviceResource[];
  readonly totalElements: number;
  readonly totalPages: number;
  readonly size: number;
  readonly number: number;
}
