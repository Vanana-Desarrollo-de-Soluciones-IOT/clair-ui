import { Observable } from 'rxjs';
import { CreateOrganizationCommand } from '../model/commands/create-organization.command';
import { CreateSpaceCommand } from '../model/commands/create-space.command';
import { ClaimDeviceCommand } from '../model/commands/claim-device.command';
import { PairDeviceCommand } from '../model/commands/pair-device.command';
import { DeleteOrganizationCommand } from '../model/commands/delete-organization.command';
import { DeleteSpaceCommand } from '../model/commands/delete-space.command';
import { DeleteDeviceCommand } from '../model/commands/delete-device.command';
import { UpdateDeviceStatusCommand } from '../model/commands/update-device-status.command';
import { UpdateDeviceConfigurationCommand } from '../model/commands/update-device-configuration.command';
import { UpdateDeviceNameCommand } from '../model/commands/update-device-name.command';
import { UpdateDeviceSerialNumberCommand } from '../model/commands/update-device-serial-number.command';
import { UpdateSpaceNameCommand } from '../model/commands/update-space-name.command';
import { UpdateOrganizationNameCommand } from '../model/commands/update-organization-name.command';
import { Organization } from './device-query-service';
import { Space } from './device-query-service';
import { Device } from './device-query-service';

export interface DeviceCommandService {
  handleCreateOrganization(command: CreateOrganizationCommand): Observable<Organization>;
  handleCreateSpace(command: CreateSpaceCommand): Observable<Space>;
  handleClaimDevice(command: ClaimDeviceCommand): Observable<Device>;
  handlePairDevice(command: PairDeviceCommand): Observable<Device>;
  handleDeleteOrganization(command: DeleteOrganizationCommand): Observable<void>;
  handleDeleteSpace(command: DeleteSpaceCommand): Observable<void>;
  handleDeleteDevice(command: DeleteDeviceCommand): Observable<void>;
  handleUpdateDeviceStatus(command: UpdateDeviceStatusCommand): Observable<void>;
  handleUpdateDeviceConfiguration(command: UpdateDeviceConfigurationCommand): Observable<void>;
  handleUpdateDeviceName(command: UpdateDeviceNameCommand): Observable<void>;
  handleUpdateDeviceSerialNumber(command: UpdateDeviceSerialNumberCommand): Observable<void>;
  handleUpdateSpaceName(command: UpdateSpaceNameCommand): Observable<void>;
  handleUpdateOrganizationName(command: UpdateOrganizationNameCommand): Observable<void>;
}
