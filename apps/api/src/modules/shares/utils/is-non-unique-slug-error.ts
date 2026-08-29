import { Prisma } from '@/generated/prisma/client';
import { PRISMA_ERROR_CODES } from '@/modules/prisma';

export const isNonUniqueSlugError = (error: unknown): boolean => {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === PRISMA_ERROR_CODES.NON_UNIQUE &&
    Array.isArray(error.meta?.target) &&
    error.meta.target.includes('slug')
  );
};
