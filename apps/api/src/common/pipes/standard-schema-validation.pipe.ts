import { HttpStatus, StandardSchemaValidationPipe } from '@nestjs/common';
import { CommonErrorCode } from '@md-share/contracts';
import { ApiException } from '../exceptions';
import { CommonMessages } from '../messages';

const formatIssuePath = (path: readonly unknown[] | undefined): string => {
  if (!path?.length) {
    return 'root';
  }

  return path
    .map((segment) => {
      if (typeof segment === 'object' && segment !== null && 'key' in segment) {
        return String(segment.key);
      }

      return String(segment);
    })
    .join('.');
};

export const createStandardSchemaValidationPipe =
  (): StandardSchemaValidationPipe =>
    new StandardSchemaValidationPipe({
      exceptionFactory: (issues) =>
        new ApiException(
          HttpStatus.BAD_REQUEST,
          CommonErrorCode.REQUEST_VALIDATION,
          CommonMessages.REQUEST_VALIDATION,
          issues.map((issue) => ({
            field: formatIssuePath(issue.path),
            message: issue.message,
          })),
        ),
    });
