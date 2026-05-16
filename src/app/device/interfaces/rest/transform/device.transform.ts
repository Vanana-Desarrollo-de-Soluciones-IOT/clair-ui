import { DeviceResource, DevicePageResource } from '../resources/device.resource';
import { Device, DevicePage } from '../../../domain/services/device-query-service';
import { createDeviceId } from '../../../domain/model/valueobjects/device-id.value-object';
import { createSpaceId } from '../../../domain/model/valueobjects/space-id.value-object';
import { createDeviceStatus } from '../../../domain/model/valueobjects/device-status.value-object';

export const deviceResourceToDomain = (resource: DeviceResource): Device => {
  return Object.freeze({
    id: createDeviceId(resource.id),
    serialNumber: resource.serialNumber,
    name: resource.name,
    status: createDeviceStatus(resource.status),
    spaceId: createSpaceId(resource.spaceId),
    configuration: Object.freeze({ ...resource.configuration }),
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
