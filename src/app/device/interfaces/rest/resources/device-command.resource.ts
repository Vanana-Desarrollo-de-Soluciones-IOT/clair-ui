import { DeviceCommandStatus } from '../../../domain/model/valueobjects/device-command-status.value-object';
import { DeviceCommandType } from '../../../domain/model/valueobjects/device-command-type.value-object';

export interface DeviceCommandResource {
  readonly id: string;
  readonly deviceId: string;
  readonly type: DeviceCommandType;
  readonly status: DeviceCommandStatus;
  readonly payload: string | null;
  readonly sentAt: string | null;
  readonly executedAt: string | null;
  readonly failureReason: string | null;
  readonly createdAt: string | null;
}

