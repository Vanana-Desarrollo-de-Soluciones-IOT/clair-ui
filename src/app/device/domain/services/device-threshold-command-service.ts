import { Observable } from 'rxjs';
import { CreateDeviceThresholdCommand } from '../model/commands/create-device-threshold.command';
import { UpdateDeviceThresholdCommand } from '../model/commands/update-device-threshold.command';
import { DeleteDeviceThresholdCommand } from '../model/commands/delete-device-threshold.command';
import { DeviceThreshold } from './device-threshold-query-service';

export interface DeviceThresholdCommandService {
  handleCreateDeviceThreshold(command: CreateDeviceThresholdCommand): Observable<DeviceThreshold>;
  handleUpdateDeviceThreshold(command: UpdateDeviceThresholdCommand): Observable<DeviceThreshold>;
  handleDeleteDeviceThreshold(command: DeleteDeviceThresholdCommand): Observable<void>;
}

