import type { ApiError } from '@md-share/contracts';

export class ApiException extends Error {
  public constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly details?: ApiError['details'],
  ) {
    super(message);
    this.name = 'ApiException';
  }
}
