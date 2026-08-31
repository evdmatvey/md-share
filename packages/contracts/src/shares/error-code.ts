export const SharesErrorCode = {
  NOT_FOUND: 'SHARES_NOT_FOUND',
  SLUG_GENERATION_FAILED: 'SHARES_SLUG_GENERATION_FAILED',
} as const;

export type SharesErrorCode = (typeof SharesErrorCode)[keyof typeof SharesErrorCode];
