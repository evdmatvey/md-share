import z from 'zod';

export const shareSchema = z.object({
  slug: z.string().length(6),
  markdown: z.string().min(1),
  createdAt: z.string().datetime(),
});

export type Share = z.infer<typeof shareSchema>;
