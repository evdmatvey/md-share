import { Catch, HttpException, HttpStatus, Logger } from '@nestjs/common';
import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { CommonErrorCode } from '@md-share/contracts';
import type { ApiError } from '@md-share/contracts';
import { ApiException } from '../exceptions';
import { CommonMessages } from '../messages';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly _logger = new Logger(AllExceptionsFilter.name);

  public constructor(private readonly _httpAdapterHost: HttpAdapterHost) {}

  public catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this._httpAdapterHost;
    const ctx = host.switchToHttp();
    const body = this._toApiError(exception);

    this._log(exception, body.statusCode);

    httpAdapter.reply(ctx.getResponse(), body, body.statusCode);
  }

  private _toApiError(exception: unknown): ApiError {
    if (exception instanceof ApiException) {
      return {
        statusCode: exception.statusCode,
        error: exception.code,
        message: exception.message,
        ...(exception.details ? { details: exception.details } : {}),
      };
    }

    if (this._isRequestValidationError(exception)) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        error: CommonErrorCode.REQUEST_VALIDATION,
        message: CommonMessages.REQUEST_VALIDATION,
      };
    }

    if (this._isNotFoundError(exception)) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        error: CommonErrorCode.NOT_FOUND,
        message: CommonMessages.NOT_FOUND,
      };
    }

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: CommonErrorCode.INTERNAL_ERROR,
      message: CommonMessages.INTERNAL_ERROR,
    };
  }

  private _isRequestValidationError(exception: unknown): boolean {
    if (exception instanceof HttpException) {
      return this._isStatus(exception.getStatus(), HttpStatus.BAD_REQUEST);
    }

    return this._isJsonParseError(exception);
  }

  private _isJsonParseError(exception: unknown): boolean {
    if (!(exception instanceof SyntaxError) || !this._isHttpLike(exception)) {
      return false;
    }

    return (
      this._isStatus(exception.status, HttpStatus.BAD_REQUEST) ||
      exception.type === 'entity.parse.failed'
    );
  }

  private _isNotFoundError(exception: unknown): boolean {
    return (
      exception instanceof HttpException &&
      this._isStatus(exception.getStatus(), HttpStatus.NOT_FOUND)
    );
  }

  private _isHttpLike(
    exception: object,
  ): exception is { readonly status?: number; readonly type?: string } {
    return 'status' in exception || 'type' in exception;
  }

  private _isStatus(status: number | undefined, expected: number): boolean {
    return status === expected;
  }

  private _log(exception: unknown, statusCode: number): void {
    const message =
      exception instanceof Error
        ? (exception.stack ?? exception.message)
        : String(exception);

    const internalServerError: number = HttpStatus.INTERNAL_SERVER_ERROR;

    if (statusCode >= internalServerError) {
      this._logger.error(message);
      return;
    }

    this._logger.warn(message);
  }
}
