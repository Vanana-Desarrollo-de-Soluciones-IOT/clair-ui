import { ClaimDeviceCommand } from '../../../domain/model/commands/claim-device.command';
import { ClaimDeviceResource } from '../resources/claim-device.resource';

export const claimDeviceCommandToResource = (
  command: ClaimDeviceCommand
): ClaimDeviceResource => {
  return {
    claimToken: command.claimToken,
    spaceId: command.spaceId.value,
  };
};
