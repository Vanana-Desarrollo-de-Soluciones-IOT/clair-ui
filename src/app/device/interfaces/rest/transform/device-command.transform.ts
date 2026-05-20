import { DeviceCommand } from '../../../domain/services/device-command-service';
import { createDeviceId } from '../../../domain/model/valueobjects/device-id.value-object';
import { DeviceCommandResource } from '../resources/device-command.resource';

export const deviceCommandResourceToDomain = (resource: DeviceCommandResource): DeviceCommand => {
  return Object.freeze({
    id: resource.id,
    deviceId: createDeviceId(resource.deviceId),
    type: resource.type,
    status: resource.status,
    payload: resource.payload,
    sentAt: resource.sentAt,
    executedAt: resource.executedAt,
    failureReason: resource.failureReason,
    createdAt: resource.createdAt,
  });
};

