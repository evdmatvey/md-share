export const CommonErrorCode = {
  REQUEST_VALIDATION: 'REQUEST_VALIDATION',
  NOT_FOUND: 'NOT_FOUND',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

export type CommonErrorCode = (typeof CommonErrorCode)[keyof typeof CommonErrorCode];
