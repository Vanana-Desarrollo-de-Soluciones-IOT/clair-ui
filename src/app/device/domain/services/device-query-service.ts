import { Observable } from 'rxjs';
import { GetOrganizationsByOwnerQuery } from '../model/queries/get-organizations-by-owner.query';
import { GetOrganizationByIdQuery } from '../model/queries/get-organization-by-id.query';
import { GetSpacesByOrganizationQuery } from '../model/queries/get-spaces-by-organization.query';
import { GetSpacesByOwnerQuery } from '../model/queries/get-spaces-by-owner.query';
import { GetSpaceByIdQuery } from '../model/queries/get-space-by-id.query';
import { GetDevicesBySpaceQuery } from '../model/queries/get-devices-by-space.query';
import { GetDeviceByIdQuery } from '../model/queries/get-device-by-id.query';
import { GetDeviceBySerialNumberQuery } from '../model/queries/get-device-by-serial-number.query';
import { OrganizationId } from '../model/valueobjects/organization-id.value-object';
import { SpaceId } from '../model/valueobjects/space-id.value-object';
import { DeviceId } from '../model/valueobjects/device-id.value-object';
import { DeviceStatus } from '../model/valueobjects/device-status.value-object';
import { UserId } from '../model/valueobjects/user-id.value-object';

export type Organization = Readonly<{
  id: OrganizationId;
  name: string;
  ownerUserId: UserId;
  createdAt: string;
  updatedAt: string;
}>;

export type Space = Readonly<{
  id: SpaceId;
  name: string;
  organizationId: OrganizationId;
  ownerUserId: UserId;
  createdAt: string;
  updatedAt: string;
}>;

export type Device = Readonly<{
  id: DeviceId;
  serialNumber: string;
  name: string;
  status: DeviceStatus;
  spaceId: SpaceId | null;
  ownerUserId: UserId | null;
  configuration: Record<string, string>;
  hardwareId: string;
  apiKey: string;
  deviceType: string;
  claimToken: string | null;
  activatedAt: string | null;
  lastSeenAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}>;

export type DevicePage = Readonly<{
  content: readonly Device[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}>;

export interface DeviceQueryService {
  handleGetOrganizationsByOwner(query: GetOrganizationsByOwnerQuery): Observable<Organization[]>;
  handleGetOrganizationById(query: GetOrganizationByIdQuery): Observable<Organization | null>;
  handleGetSpacesByOrganization(query: GetSpacesByOrganizationQuery): Observable<Space[]>;
  handleGetSpacesByOwner(query: GetSpacesByOwnerQuery): Observable<Space[]>;
  handleGetSpaceById(query: GetSpaceByIdQuery): Observable<Space | null>;
  handleGetDevicesBySpace(query: GetDevicesBySpaceQuery): Observable<DevicePage>;
  handleGetDeviceById(query: GetDeviceByIdQuery): Observable<Device | null>;
  handleGetDeviceBySerialNumber(query: GetDeviceBySerialNumberQuery): Observable<Device | null>;
}
