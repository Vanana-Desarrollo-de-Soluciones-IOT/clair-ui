import { PushNotificationLog, createPushNotificationLog } from './push-notification-log.value-object';

export type PushNotificationLogPage = Readonly<{
  content: ReadonlyArray<PushNotificationLog>;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}>;

const ensureNonNegativeInteger = (value: number, fieldName: string): void => {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`${fieldName} must be a non-negative integer.`);
  }
};

export const createPushNotificationLogPage = (
  page: PushNotificationLogPage,
): PushNotificationLogPage => {
  ensureNonNegativeInteger(page.totalElements, 'totalElements');
  ensureNonNegativeInteger(page.totalPages, 'totalPages');
  ensureNonNegativeInteger(page.size, 'size');
  ensureNonNegativeInteger(page.number, 'number');

  return Object.freeze({
    content: Object.freeze(page.content.map(createPushNotificationLog)),
    totalElements: page.totalElements,
    totalPages: page.totalPages,
    size: page.size,
    number: page.number,
  });
};
