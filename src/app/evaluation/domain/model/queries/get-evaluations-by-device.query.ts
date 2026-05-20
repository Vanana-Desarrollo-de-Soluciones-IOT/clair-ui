import { EvaluationDeviceId } from '../valueobjects/evaluation-device-id.value-object';

export type GetEvaluationsByDeviceQuery = Readonly<{
  deviceId: EvaluationDeviceId;
  page: number;
  size: number;
}>;

export const createGetEvaluationsByDeviceQuery = (
  deviceId: EvaluationDeviceId,
  page: number,
  size: number
): GetEvaluationsByDeviceQuery => {
  if (!Number.isInteger(page) || page < 0) throw new Error('Page must be a non-negative integer');
  if (!Number.isInteger(size) || size < 1 || size > 200) throw new Error('Size must be an integer between 1 and 200');
  return Object.freeze({ deviceId, page, size });
};

