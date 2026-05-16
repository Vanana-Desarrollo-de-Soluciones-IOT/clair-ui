import { UpdateDeviceSerialNumberCommand } from '../../../domain/model/commands/update-device-serial-number.command';
import { UpdateDeviceSerialNumberResource } from '../resources/update-device-serial-number.resource';

export const updateDeviceSerialNumberCommandToResource = (
  command: UpdateDeviceSerialNumberCommand
): UpdateDeviceSerialNumberResource => {
  return {
    serialNumber: command.serialNumber.value,
  };
};
