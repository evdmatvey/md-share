import { ApiErrorSchema, CommonErrorCode } from '@md-share/contracts';
import type { ApiError } from '@md-share/contracts';
import axios, { AxiosError } from 'axios';
import { commonMessages } from '@shared/messages/strings';

const TRANSPORT_STATUS_CODE = 0;

const TransportErrorCode = {
  NETWORK: 'NETWORK',
  TIMEOUT: 'TIMEOUT',
  CANCELED: 'CANCELED',
} as const;

const fallbackApiError: ApiError = {
  statusCode: 500,
  error: CommonErrorCode.INTERNAL_ERROR,
  message: commonMessages.internalError,
};

export type ApiRequestErrorKind =
  'api' | 'network' | 'timeout' | 'canceled' | 'unknown';

export const parseApiError = (value: unknown): ApiError | null => {
  const result = ApiErrorSchema.safeParse(value);

  return result.success ? result.data : null;
};

export const ApiRequestError = class ApiRequestError extends Error {
  public readonly statusCode: number;
  public readonly error: string;
  public readonly details?: ApiError['details'];
  public readonly kind: ApiRequestErrorKind;
  public override readonly cause?: unknown;

  public constructor(
    payload: ApiError,
    options: {
      readonly kind?: ApiRequestErrorKind;
      readonly cause?: unknown;
    } = {},
  ) {
    super(payload.message, { cause: options.cause });
    this.name = 'ApiRequestError';
    this.statusCode = payload.statusCode;
    this.error = payload.error;
    this.details = payload.details;
    this.kind = options.kind ?? 'api';
    this.cause = options.cause;
  }
};

export type ApiRequestError = InstanceType<typeof ApiRequestError>;

export const isApiRequestError = (error: unknown): error is ApiRequestError => {
  return error instanceof ApiRequestError;
};

export const isValidationError = (error: unknown): error is ApiRequestError => {
  return (
    isApiRequestError(error) &&
    error.kind === 'api' &&
    error.error === CommonErrorCode.REQUEST_VALIDATION
  );
};

export const fieldErrorsFrom = (
  error: ApiRequestError,
): Record<string, string> => {
  const fields: Record<string, string> = {};

  for (const detail of error.details ?? []) {
    fields[detail.field] = detail.message;
  }

  return fields;
};

const isAxiosTimeoutError = (error: AxiosError): boolean => {
  return (
    error.code === AxiosError.ECONNABORTED ||
    error.code === AxiosError.ETIMEDOUT
  );
};

const toRequestError = (
  payload: ApiError,
  kind: ApiRequestErrorKind,
  cause: unknown,
): ApiRequestError => {
  return new ApiRequestError(payload, { kind, cause });
};

export const toApiRequestError = (error: unknown): ApiRequestError => {
  if (error instanceof ApiRequestError) {
    return error;
  }

  if (!axios.isAxiosError(error)) {
    return toRequestError(fallbackApiError, 'unknown', error);
  }

  const parsed = parseApiError(error.response?.data);

  if (parsed) {
    return toRequestError(parsed, 'api', error);
  }

  if (isAxiosTimeoutError(error)) {
    return toRequestError(
      {
        statusCode: TRANSPORT_STATUS_CODE,
        error: TransportErrorCode.TIMEOUT,
        message: commonMessages.timeout,
      },
      'timeout',
      error,
    );
  }

  if (axios.isCancel(error)) {
    return toRequestError(
      {
        statusCode: TRANSPORT_STATUS_CODE,
        error: TransportErrorCode.CANCELED,
        message: commonMessages.canceled,
      },
      'canceled',
      error,
    );
  }

  if (error.response == null) {
    return toRequestError(
      {
        statusCode: TRANSPORT_STATUS_CODE,
        error: TransportErrorCode.NETWORK,
        message: commonMessages.network,
      },
      'network',
      error,
    );
  }

  return toRequestError(
    {
      ...fallbackApiError,
      statusCode: error.response.status,
    },
    'unknown',
    error,
  );
};
