import { Observable } from 'rxjs';
import { CreateOrganizationCommand } from '../model/commands/create-organization.command';
import { CreateSpaceCommand } from '../model/commands/create-space.command';
import { ClaimDeviceCommand } from '../model/commands/claim-device.command';
import { PairDeviceCommand } from '../model/commands/pair-device.command';
import { DeleteOrganizationCommand } from '../model/commands/delete-organization.command';
import { DeleteSpaceCommand } from '../model/commands/delete-space.command';
import { ResetDeviceAssignmentCommand } from '../model/commands/reset-device-assignment.command';
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
  handleResetDeviceAssignment(command: ResetDeviceAssignmentCommand): Observable<void>;
  handleUpdateSpaceName(command: UpdateSpaceNameCommand): Observable<void>;
  handleUpdateOrganizationName(command: UpdateOrganizationNameCommand): Observable<void>;
}
