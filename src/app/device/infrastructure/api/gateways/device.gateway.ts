import { Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';
import { OrganizationResource } from '../../../interfaces/rest/resources/organization.resource';
import { SpaceResource } from '../../../interfaces/rest/resources/space.resource';
import { DeviceResource, DevicePageResource } from '../../../interfaces/rest/resources/device.resource';
import { CreateOrganizationResource } from '../../../interfaces/rest/resources/create-organization.resource';
import { CreateSpaceResource } from '../../../interfaces/rest/resources/create-space.resource';
import { RegisterDeviceResource } from '../../../interfaces/rest/resources/register-device.resource';
import { UpdateDeviceStatusResource } from '../../../interfaces/rest/resources/update-device-status.resource';
import { UpdateDeviceConfigurationResource } from '../../../interfaces/rest/resources/update-device-configuration.resource';
import { UpdateDeviceNameResource } from '../../../interfaces/rest/resources/update-device-name.resource';
import { UpdateDeviceSerialNumberResource } from '../../../interfaces/rest/resources/update-device-serial-number.resource';
import { UpdateSpaceNameResource } from '../../../interfaces/rest/resources/update-space-name.resource';
import { UpdateOrganizationNameResource } from '../../../interfaces/rest/resources/update-organization-name.resource';

export interface DeviceGateway {
  createOrganization(resource: CreateOrganizationResource): Observable<OrganizationResource>;
  getOrganizations(): Observable<OrganizationResource[]>;
  getOrganizationById(organizationId: string): Observable<OrganizationResource>;
  deleteOrganization(organizationId: string): Observable<void>;
  updateOrganizationName(organizationId: string, resource: UpdateOrganizationNameResource): Observable<void>;

  createSpace(organizationId: string, resource: CreateSpaceResource): Observable<SpaceResource>;
  getSpacesByOrganization(organizationId: string): Observable<SpaceResource[]>;
  getSpacesByOwner(): Observable<SpaceResource[]>;
  getSpaceById(spaceId: string): Observable<SpaceResource>;
  deleteSpace(spaceId: string): Observable<void>;
  updateSpaceName(spaceId: string, resource: UpdateSpaceNameResource): Observable<void>;

  registerDevice(resource: RegisterDeviceResource): Observable<DeviceResource>;
  getDevicesBySpace(spaceId: string, page: number, size: number): Observable<DevicePageResource>;
  getDeviceById(deviceId: string): Observable<DeviceResource>;
  getDeviceBySerialNumber(serialNumber: string): Observable<DeviceResource>;
  updateDeviceStatus(deviceId: string, resource: UpdateDeviceStatusResource): Observable<void>;
  updateDeviceConfiguration(deviceId: string, resource: UpdateDeviceConfigurationResource): Observable<void>;
  updateDeviceName(deviceId: string, resource: UpdateDeviceNameResource): Observable<void>;
  updateDeviceSerialNumber(deviceId: string, resource: UpdateDeviceSerialNumberResource): Observable<void>;
  deleteDevice(deviceId: string): Observable<void>;
}

export const DEVICE_GATEWAY = new InjectionToken<DeviceGateway>('DEVICE_GATEWAY');
