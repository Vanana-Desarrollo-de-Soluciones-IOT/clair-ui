import { PairDeviceCommand } from '../../../domain/model/commands/pair-device.command';
import { PairDeviceResource } from '../resources/pair-device.resource';

export const pairDeviceCommandToResource = (
  command: PairDeviceCommand
): PairDeviceResource => {
  return {
    hardwareId: command.hardwareId,
    // Backend currently requires the field, but device type is resolved from factory inventory.
    deviceType: 'air-quality-v1',
  };
};
