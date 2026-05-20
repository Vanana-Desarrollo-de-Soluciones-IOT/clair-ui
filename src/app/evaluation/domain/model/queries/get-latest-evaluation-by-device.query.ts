import { EvaluationDeviceId } from '../valueobjects/evaluation-device-id.value-object';

export type GetLatestEvaluationByDeviceQuery = Readonly<{
  deviceId: EvaluationDeviceId;
}>;

export const createGetLatestEvaluationByDeviceQuery = (
  deviceId: EvaluationDeviceId
): GetLatestEvaluationByDeviceQuery => {
  return Object.freeze({ deviceId });
};

