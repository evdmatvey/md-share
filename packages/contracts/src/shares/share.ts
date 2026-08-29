import { z } from 'zod';

export const shareSlugSchema = z.string().length(6);

export const shareSchema = z.object({
  slug: shareSlugSchema,
  markdown: z.string().min(1),
  createdAt: z.iso.datetime(),
});

export type Share = z.infer<typeof shareSchema>;
