import { AlertResponseResource } from '../resources/alert-response.resource';
import { AlertPageResource } from '../resources/alert-page.resource';
import { Alert, AlertPage } from '../../../domain/services/alert-query-service';
import { createAlertId } from '../../../domain/model/valueobjects/alert-id.value-object';
import { createAlertStatus } from '../../../domain/model/valueobjects/alert-status.value-object';
import { createMetricType } from '../../../domain/model/valueobjects/metric-type.value-object';

export const alertResponseResourceToDomain = (resource: AlertResponseResource): Alert => {
  return Object.freeze({
    id: createAlertId(resource.id),
    deviceId: resource.deviceId,
    spaceId: resource.spaceId,
    metric: createMetricType(resource.metric),
    metricLabel: resource.metricLabel,
    metricUnit: resource.metricUnit,
    thresholdValue: resource.thresholdValue,
    actualValue: resource.actualValue,
    message: resource.message,
    status: createAlertStatus(resource.status),
    occurredAt: resource.occurredAt,
    resolvedAt: resource.resolvedAt,
    createdAt: resource.createdAt,
  });
};

export const alertPageResourceToDomain = (resource: AlertPageResource): AlertPage => {
  return Object.freeze({
    content: Object.freeze(resource.content.map(alertResponseResourceToDomain)),
    totalElements: resource.totalElements,
    totalPages: resource.totalPages,
    size: resource.size,
    number: resource.number,
  });
};
