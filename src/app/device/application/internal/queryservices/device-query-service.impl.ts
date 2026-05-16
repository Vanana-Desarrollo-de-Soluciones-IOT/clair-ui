import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DeviceQueryService, Organization, Space, DevicePage, Device } from '../../../domain/services/device-query-service';
import { GetOrganizationsByOwnerQuery } from '../../../domain/model/queries/get-organizations-by-owner.query';
import { GetOrganizationByIdQuery } from '../../../domain/model/queries/get-organization-by-id.query';
import { GetSpacesByOrganizationQuery } from '../../../domain/model/queries/get-spaces-by-organization.query';
import { GetSpacesByOwnerQuery } from '../../../domain/model/queries/get-spaces-by-owner.query';
import { GetSpaceByIdQuery } from '../../../domain/model/queries/get-space-by-id.query';
import { GetDevicesBySpaceQuery } from '../../../domain/model/queries/get-devices-by-space.query';
import { GetDeviceByIdQuery } from '../../../domain/model/queries/get-device-by-id.query';
import { GetDeviceBySerialNumberQuery } from '../../../domain/model/queries/get-device-by-serial-number.query';
import { DeviceHttpGateway } from '../../../infrastructure/api/gateways/device-http.gateway';
import { organizationResourceToDomain } from '../../../interfaces/rest/transform/organization.transform';
import { spaceResourceToDomain } from '../../../interfaces/rest/transform/space.transform';
import { devicePageResourceToDomain, deviceResourceToDomain } from '../../../interfaces/rest/transform/device.transform';

@Injectable({ providedIn: 'root' })
export class DeviceQueryServiceImpl implements DeviceQueryService {
  constructor(private readonly deviceGateway: DeviceHttpGateway) {}

  handleGetOrganizationsByOwner(_query: GetOrganizationsByOwnerQuery): Observable<Organization[]> {
    return this.deviceGateway.getOrganizations().pipe(
      map((resources) => resources.map(organizationResourceToDomain))
    );
  }

  handleGetOrganizationById(query: GetOrganizationByIdQuery): Observable<Organization | null> {
    return this.deviceGateway.getOrganizationById(query.organizationId.value).pipe(
      map((resource) => organizationResourceToDomain(resource)),
      catchError(() => of(null))
    );
  }

  handleGetSpacesByOrganization(query: GetSpacesByOrganizationQuery): Observable<Space[]> {
    return this.deviceGateway.getSpacesByOrganization(query.organizationId.value).pipe(
      map((resources) => resources.map(spaceResourceToDomain))
    );
  }

  handleGetSpaceById(query: GetSpaceByIdQuery): Observable<Space | null> {
    return this.deviceGateway.getSpaceById(query.spaceId.value).pipe(
      map((resource) => spaceResourceToDomain(resource)),
      catchError(() => of(null))
    );
  }

  handleGetSpacesByOwner(_query: GetSpacesByOwnerQuery): Observable<Space[]> {
    return this.deviceGateway.getSpacesByOwner().pipe(
      map((resources) => resources.map(spaceResourceToDomain))
    );
  }

  handleGetDevicesBySpace(query: GetDevicesBySpaceQuery): Observable<DevicePage> {
    return this.deviceGateway
      .getDevicesBySpace(query.spaceId.value, query.page, query.size)
      .pipe(map((resource) => devicePageResourceToDomain(resource)));
  }

  handleGetDeviceById(query: GetDeviceByIdQuery): Observable<Device | null> {
    return this.deviceGateway.getDeviceById(query.deviceId.value).pipe(
      map((resource) => deviceResourceToDomain(resource)),
      catchError(() => of(null))
    );
  }

  handleGetDeviceBySerialNumber(query: GetDeviceBySerialNumberQuery): Observable<Device | null> {
    return this.deviceGateway.getDeviceBySerialNumber(query.serialNumber.value).pipe(
      map((resource) => deviceResourceToDomain(resource)),
      catchError(() => of(null))
    );
  }
}
