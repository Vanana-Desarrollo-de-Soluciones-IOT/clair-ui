import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DeviceGateway } from './device.gateway';
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
import { API_CONFIG } from '../../../../api.config';

@Injectable({ providedIn: 'root' })
export class DeviceHttpGateway implements DeviceGateway {
  private readonly orgUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.organizations;
  private readonly spaceUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.spaces;
  private readonly deviceUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.devices;

  constructor(private readonly http: HttpClient) {}

  createOrganization(resource: CreateOrganizationResource): Observable<OrganizationResource> {
    return this.http.post<OrganizationResource>(this.orgUrl, resource);
  }

  getOrganizations(): Observable<OrganizationResource[]> {
    return this.http.get<OrganizationResource[]>(this.orgUrl);
  }

  getOrganizationById(organizationId: string): Observable<OrganizationResource> {
    return this.http.get<OrganizationResource>(`${this.orgUrl}/${organizationId}`);
  }

  deleteOrganization(organizationId: string): Observable<void> {
    return this.http.delete<void>(`${this.orgUrl}/${organizationId}`);
  }

  updateOrganizationName(organizationId: string, resource: UpdateOrganizationNameResource): Observable<void> {
    return this.http.patch<void>(`${this.orgUrl}/${organizationId}/name`, resource);
  }

  createSpace(organizationId: string, resource: CreateSpaceResource): Observable<SpaceResource> {
    return this.http.post<SpaceResource>(`${this.spaceUrl}?organizationId=${organizationId}`, resource);
  }

  getSpacesByOrganization(organizationId: string): Observable<SpaceResource[]> {
    return this.http.get<SpaceResource[]>(`${this.spaceUrl}?organizationId=${organizationId}`);
  }

  getSpacesByOwner(): Observable<SpaceResource[]> {
    return this.http.get<SpaceResource[]>(this.spaceUrl);
  }

  getSpaceById(spaceId: string): Observable<SpaceResource> {
    return this.http.get<SpaceResource>(`${this.spaceUrl}/${spaceId}`);
  }

  deleteSpace(spaceId: string): Observable<void> {
    return this.http.delete<void>(`${this.spaceUrl}/${spaceId}`);
  }

  updateSpaceName(spaceId: string, resource: UpdateSpaceNameResource): Observable<void> {
    return this.http.patch<void>(`${this.spaceUrl}/${spaceId}/name`, resource);
  }

  registerDevice(resource: RegisterDeviceResource): Observable<DeviceResource> {
    return this.http.post<DeviceResource>(this.deviceUrl, resource);
  }

  getDevicesBySpace(spaceId: string, page: number, size: number): Observable<DevicePageResource> {
    const params = new HttpParams()
      .set('spaceId', spaceId)
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<DevicePageResource>(this.deviceUrl, { params });
  }

  getDeviceById(deviceId: string): Observable<DeviceResource> {
    return this.http.get<DeviceResource>(`${this.deviceUrl}/${deviceId}`);
  }

  getDeviceBySerialNumber(serialNumber: string): Observable<DeviceResource> {
    return this.http.get<DeviceResource>(`${this.deviceUrl}/serial-number/${serialNumber}`);
  }

  updateDeviceStatus(deviceId: string, resource: UpdateDeviceStatusResource): Observable<void> {
    return this.http.patch<void>(`${this.deviceUrl}/${deviceId}/status`, resource);
  }

  updateDeviceConfiguration(deviceId: string, resource: UpdateDeviceConfigurationResource): Observable<void> {
    return this.http.patch<void>(`${this.deviceUrl}/${deviceId}/configuration`, resource);
  }

  updateDeviceName(deviceId: string, resource: UpdateDeviceNameResource): Observable<void> {
    return this.http.patch<void>(`${this.deviceUrl}/${deviceId}/name`, resource);
  }

  updateDeviceSerialNumber(deviceId: string, resource: UpdateDeviceSerialNumberResource): Observable<void> {
    return this.http.patch<void>(`${this.deviceUrl}/${deviceId}/serial-number`, resource);
  }

  deleteDevice(deviceId: string): Observable<void> {
    return this.http.delete<void>(`${this.deviceUrl}/${deviceId}`);
  }
}
