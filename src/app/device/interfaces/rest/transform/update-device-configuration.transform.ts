import { UpdateDeviceConfigurationCommand } from '../../../domain/model/commands/update-device-configuration.command';
import { UpdateDeviceConfigurationResource } from '../resources/update-device-configuration.resource';

export const updateDeviceConfigurationCommandToResource = (
  command: UpdateDeviceConfigurationCommand
): UpdateDeviceConfigurationResource => {
  return {
    configuration: command.configuration,
  };
};
