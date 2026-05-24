import { MetricThreshold } from '../../../domain/model/valueobjects/metric-threshold.value-object';
import { ThresholdOperator } from '../../../domain/model/valueobjects/threshold-operator.value-object';

export type DeviceThresholdResource = Readonly<{
  id: string;
  deviceId: string;
  metric: MetricThreshold;
  metricLabel: string;
  metricUnit: string;
  operator: ThresholdOperator;
  operatorSymbol: string;
  value: number;
  enabled: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}>;

