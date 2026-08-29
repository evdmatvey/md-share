import type { CommonErrorCode } from './common/error-code.js';
import type { SharesErrorCode } from './shares/error-code.js';

export * from './common/index.js';
export * from './shares/index.js';

export type ApiErrorCode = CommonErrorCode | SharesErrorCode;
