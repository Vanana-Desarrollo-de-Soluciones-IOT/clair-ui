import { DeviceId } from '../valueobjects/device-id.value-object';
import { MetricThreshold } from '../valueobjects/metric-threshold.value-object';
import { ThresholdOperator } from '../valueobjects/threshold-operator.value-object';
import { ThresholdValue, createThresholdValue } from '../valueobjects/threshold-value.value-object';

export type UpdateDeviceThresholdCommand = Readonly<{
  deviceId: DeviceId;
  metric: MetricThreshold;
  operator: ThresholdOperator;
  value: ThresholdValue;
  enabled: boolean;
}>;

export const createUpdateDeviceThresholdCommand = (
  deviceId: DeviceId,
  metric: MetricThreshold,
  operator: ThresholdOperator,
  value: number,
  enabled: boolean
): UpdateDeviceThresholdCommand => {
  if (!deviceId) throw new Error('Device ID is required');
  if (!metric) throw new Error('Metric is required');
  if (!operator) throw new Error('Operator is required');
  return Object.freeze({
    deviceId,
    metric,
    operator,
    value: createThresholdValue(value),
    enabled: Boolean(enabled),
  });
};

