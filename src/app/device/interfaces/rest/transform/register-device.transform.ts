import { RegisterDeviceCommand } from '../../../domain/model/commands/register-device.command';
import { RegisterDeviceResource } from '../resources/register-device.resource';

export const registerDeviceCommandToResource = (
  command: RegisterDeviceCommand
): RegisterDeviceResource => {
  return {
    serialNumber: command.serialNumber.value,
    name: command.name,
    spaceId: command.spaceId.value,
  };
};
