import { DeviceResource, DevicePageResource } from '../resources/device.resource';
import { Device, DevicePage } from '../../../domain/services/device-query-service';
import { createDeviceId } from '../../../domain/model/valueobjects/device-id.value-object';
import { createSpaceId } from '../../../domain/model/valueobjects/space-id.value-object';
import { createDeviceStatus } from '../../../domain/model/valueobjects/device-status.value-object';
import { createUserId } from '../../../domain/model/valueobjects/user-id.value-object';

export const deviceResourceToDomain = (resource: DeviceResource): Device => {
  return Object.freeze({
    id: createDeviceId(resource.id),
    serialNumber: resource.serialNumber,
    name: resource.name,
    status: createDeviceStatus(resource.status),
    spaceId: resource.spaceId ? createSpaceId(resource.spaceId) : null,
    ownerUserId: resource.ownerUserId ? createUserId(resource.ownerUserId) : null,
    configuration: Object.freeze({ ...resource.configuration }),
    hardwareId: resource.hardwareId,
    apiKey: resource.apiKey,
    deviceType: resource.deviceType,
    claimToken: resource.claimToken,
    activatedAt: resource.activatedAt,
    lastSeenAt: resource.lastSeenAt,
    createdAt: resource.createdAt,
    updatedAt: resource.updatedAt,
  });
};

export const devicePageResourceToDomain = (resource: DevicePageResource): DevicePage => {
  return Object.freeze({
    content: Object.freeze(resource.content.map(deviceResourceToDomain)),
    totalElements: resource.totalElements,
    totalPages: resource.totalPages,
    size: resource.size,
    number: resource.number,
  });
};
