import { Injectable } from '@nestjs/common';
import {
  type CreateShareRequest,
  type Share,
  SharesErrorCode,
} from '@md-share/contracts';
import { nanoid } from 'nanoid';
import { ApiException } from '@/common/exceptions';
import { SharesMessages } from './messages';
import { SharesRepository } from './shares.repository';
import { isNonUniqueSlugError } from './utils/is-non-unique-slug-error';
import { toShare } from './utils/shares.mapper';

@Injectable()
export class SharesService {
  private static readonly SLUG_LENGTH = 6;
  private static readonly MAX_SLUG_GENERATION_ATTEMPTS = 3;

  public constructor(private readonly _repository: SharesRepository) {}

  public async createShare(data: CreateShareRequest): Promise<Share> {
    let attempts = 0;

    while (attempts < SharesService.MAX_SLUG_GENERATION_ATTEMPTS) {
      try {
        const slug = nanoid(SharesService.SLUG_LENGTH);

        const share = await this._repository.createShare({
          markdown: data.markdown,
          slug,
        });

        return toShare(share);
      } catch (error) {
        if (!isNonUniqueSlugError(error)) {
          throw error;
        }

        attempts++;
      }
    }

    throw new ApiException(
      500,
      SharesErrorCode.SLUG_GENERATION_FAILED,
      SharesMessages.SLUG_GENERATION_FAILED,
    );
  }
}
