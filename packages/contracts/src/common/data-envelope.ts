import { z } from 'zod';

export const dataEnvelopeSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    data: dataSchema,
  });

export type DataEnvelope<T> = {
  data: T;
};
