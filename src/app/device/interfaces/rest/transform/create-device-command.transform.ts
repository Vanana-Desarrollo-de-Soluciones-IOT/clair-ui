import { CreateDeviceCommandCommand } from '../../../domain/model/commands/create-device-command.command';
import { CreateDeviceCommandResource } from '../resources/create-device-command.resource';

export const createDeviceCommandCommandToResource = (
  command: CreateDeviceCommandCommand
): CreateDeviceCommandResource => {
  return {
    type: command.type,
    payload: command.payload,
  };
};

