import { MetricThreshold } from '../../../domain/model/valueobjects/metric-threshold.value-object';
import { ThresholdOperator } from '../../../domain/model/valueobjects/threshold-operator.value-object';

export type UpdateDeviceThresholdResource = Readonly<{
  metric: MetricThreshold;
  operator: ThresholdOperator;
  value: number;
  enabled: boolean;
}>;

