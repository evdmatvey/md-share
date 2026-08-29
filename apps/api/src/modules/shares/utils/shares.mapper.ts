import { type Share } from '@md-share/contracts';
import { type Share as PrismaShare } from '@/generated/prisma/client';

export const toShare = (data: PrismaShare): Share => ({
  slug: data.slug,
  markdown: data.markdown,
  createdAt: data.createdAt.toISOString(),
});
