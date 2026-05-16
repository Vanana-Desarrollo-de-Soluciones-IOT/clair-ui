import { UpdateDeviceStatusCommand } from '../../../domain/model/commands/update-device-status.command';
import { UpdateDeviceStatusResource } from '../resources/update-device-status.resource';

export const updateDeviceStatusCommandToResource = (
  command: UpdateDeviceStatusCommand
): UpdateDeviceStatusResource => {
  return {
    status: command.status,
  };
};
