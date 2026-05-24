export type ThresholdOperator =
  | 'GREATER_THAN'
  | 'LESS_THAN'
  | 'EQUALS'
  | 'GREATER_THAN_OR_EQUALS'
  | 'LESS_THAN_OR_EQUALS';

export const THRESHOLD_OPERATORS: readonly ThresholdOperator[] = [
  'GREATER_THAN',
  'LESS_THAN',
  'EQUALS',
  'GREATER_THAN_OR_EQUALS',
  'LESS_THAN_OR_EQUALS',
] as const;

export const getThresholdOperatorSymbol = (operator: ThresholdOperator): string => {
  switch (operator) {
    case 'GREATER_THAN':
      return '>';
    case 'LESS_THAN':
      return '<';
    case 'EQUALS':
      return '==';
    case 'GREATER_THAN_OR_EQUALS':
      return '>=';
    case 'LESS_THAN_OR_EQUALS':
      return '<=';
  }
};

