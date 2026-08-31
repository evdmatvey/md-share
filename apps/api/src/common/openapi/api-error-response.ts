import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ApiErrorSchema } from '@md-share/contracts';
import type { ApiError } from '@md-share/contracts';

export const ApiErrorResponse = (
  status: number,
  error: string,
  message: string,
  details?: ApiError['details'],
): MethodDecorator & ClassDecorator =>
  applyDecorators(
    ApiResponse({
      status,
      description: error,
      standardSchema: ApiErrorSchema,
      examples: {
        [error]: {
          summary: error,
          value: {
            statusCode: status,
            error,
            message,
            ...(details ? { details } : {}),
          },
        },
      },
    }),
  );
