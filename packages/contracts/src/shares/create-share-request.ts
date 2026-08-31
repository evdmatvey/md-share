import { z } from 'zod';

export const createShareRequestSchema = z.object({
  markdown: z.string().min(1, { error: 'Укажите markdown текст.' }),
});

export type CreateShareRequest = z.infer<typeof createShareRequestSchema>;
