import {
  type Share,
  dataEnvelopeSchema,
  shareSchema,
} from '@md-share/contracts';
import { httpClient } from './client';

const shareEnvelopeSchema = dataEnvelopeSchema(shareSchema);

export const createShare = async (markdown: string): Promise<Share> => {
  const response = await httpClient.post('/v1/shares', { markdown });

  return shareEnvelopeSchema.parse(response.data).data;
};

export const getShareBySlug = async (slug: string): Promise<Share> => {
  const response = await httpClient.get(`/v1/shares/${slug}`);

  return shareEnvelopeSchema.parse(response.data).data;
};
