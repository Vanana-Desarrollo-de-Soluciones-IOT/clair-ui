import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { DeviceCommandService } from '../../../domain/services/device-command-service';
import { DeviceQueryService, Organization, Space, Device } from '../../../domain/services/device-query-service';
import { CreateOrganizationCommand } from '../../../domain/model/commands/create-organization.command';
import { CreateSpaceCommand } from '../../../domain/model/commands/create-space.command';
import { RegisterDeviceCommand } from '../../../domain/model/commands/register-device.command';
import { DeleteOrganizationCommand } from '../../../domain/model/commands/delete-organization.command';
import { DeleteSpaceCommand } from '../../../domain/model/commands/delete-space.command';
import { DeleteDeviceCommand } from '../../../domain/model/commands/delete-device.command';
import { UpdateDeviceStatusCommand } from '../../../domain/model/commands/update-device-status.command';
import { UpdateDeviceConfigurationCommand } from '../../../domain/model/commands/update-device-configuration.command';
import { UpdateDeviceNameCommand } from '../../../domain/model/commands/update-device-name.command';
import { UpdateDeviceSerialNumberCommand } from '../../../domain/model/commands/update-device-serial-number.command';
import { UpdateSpaceNameCommand } from '../../../domain/model/commands/update-space-name.command';
import { UpdateOrganizationNameCommand } from '../../../domain/model/commands/update-organization-name.command';
import { DeviceHttpGateway } from '../../../infrastructure/api/gateways/device-http.gateway';
import { createOrganizationCommandToResource } from '../../../interfaces/rest/transform/create-organization.transform';
import { createSpaceCommandToResource } from '../../../interfaces/rest/transform/create-space.transform';
import { registerDeviceCommandToResource } from '../../../interfaces/rest/transform/register-device.transform';
import { updateDeviceStatusCommandToResource } from '../../../interfaces/rest/transform/update-device-status.transform';
import { updateDeviceConfigurationCommandToResource } from '../../../interfaces/rest/transform/update-device-configuration.transform';
import { updateDeviceNameCommandToResource } from '../../../interfaces/rest/transform/update-device-name.transform';
import { updateDeviceSerialNumberCommandToResource } from '../../../interfaces/rest/transform/update-device-serial-number.transform';
import { updateSpaceNameCommandToResource } from '../../../interfaces/rest/transform/update-space-name.transform';
import { updateOrganizationNameCommandToResource } from '../../../interfaces/rest/transform/update-organization-name.transform';
import { organizationResourceToDomain } from '../../../interfaces/rest/transform/organization.transform';
import { spaceResourceToDomain } from '../../../interfaces/rest/transform/space.transform';
import { deviceResourceToDomain } from '../../../interfaces/rest/transform/device.transform';

@Injectable({ providedIn: 'root' })
export class DeviceCommandServiceImpl implements DeviceCommandService {
  constructor(private readonly deviceGateway: DeviceHttpGateway) {}

  handleCreateOrganization(command: CreateOrganizationCommand): Observable<Organization> {
    return this.deviceGateway
      .createOrganization(createOrganizationCommandToResource(command))
      .pipe(map((resource) => organizationResourceToDomain(resource)));
  }

  handleCreateSpace(command: CreateSpaceCommand): Observable<Space> {
    return this.deviceGateway
      .createSpace(command.organizationId.value, createSpaceCommandToResource(command))
      .pipe(map((resource) => spaceResourceToDomain(resource)));
  }

  handleRegisterDevice(command: RegisterDeviceCommand): Observable<Device> {
    return this.deviceGateway
      .registerDevice(registerDeviceCommandToResource(command))
      .pipe(map((resource) => deviceResourceToDomain(resource)));
  }

  handleDeleteOrganization(command: DeleteOrganizationCommand): Observable<void> {
    return this.deviceGateway.deleteOrganization(command.organizationId.value);
  }

  handleDeleteSpace(command: DeleteSpaceCommand): Observable<void> {
    return this.deviceGateway.deleteSpace(command.spaceId.value);
  }

  handleDeleteDevice(command: DeleteDeviceCommand): Observable<void> {
    return this.deviceGateway.deleteDevice(command.deviceId.value);
  }

  handleUpdateDeviceStatus(command: UpdateDeviceStatusCommand): Observable<void> {
    return this.deviceGateway.updateDeviceStatus(
      command.deviceId.value,
      updateDeviceStatusCommandToResource(command)
    );
  }

  handleUpdateDeviceConfiguration(command: UpdateDeviceConfigurationCommand): Observable<void> {
    return this.deviceGateway.updateDeviceConfiguration(
      command.deviceId.value,
      updateDeviceConfigurationCommandToResource(command)
    );
  }

  handleUpdateDeviceName(command: UpdateDeviceNameCommand): Observable<void> {
    return this.deviceGateway.updateDeviceName(
      command.deviceId.value,
      updateDeviceNameCommandToResource(command)
    );
  }

  handleUpdateDeviceSerialNumber(command: UpdateDeviceSerialNumberCommand): Observable<void> {
    return this.deviceGateway.updateDeviceSerialNumber(
      command.deviceId.value,
      updateDeviceSerialNumberCommandToResource(command)
    );
  }

  handleUpdateSpaceName(command: UpdateSpaceNameCommand): Observable<void> {
    return this.deviceGateway.updateSpaceName(
      command.spaceId.value,
      updateSpaceNameCommandToResource(command)
    );
  }

  handleUpdateOrganizationName(command: UpdateOrganizationNameCommand): Observable<void> {
    return this.deviceGateway.updateOrganizationName(
      command.organizationId.value,
      updateOrganizationNameCommandToResource(command)
    );
  }
}
