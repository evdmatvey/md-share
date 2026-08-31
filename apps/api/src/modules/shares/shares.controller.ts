import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  SerializeOptions,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CommonErrorCode,
  SharesErrorCode,
  createShareRequestSchema,
  dataEnvelopeSchema,
  shareSchema,
} from '@md-share/contracts';
import type {
  CreateShareRequest,
  DataEnvelope,
  Share,
} from '@md-share/contracts';
import { CommonMessages } from '@/common/messages';
import { ApiErrorResponse } from '@/common/openapi';
import { SharesMessages } from './messages';
import { SharesService } from './shares.service';

const shareResponseSchema = dataEnvelopeSchema(shareSchema);

@ApiTags('shares')
@Controller('shares')
export class SharesController {
  public constructor(private readonly _sharesService: SharesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @SerializeOptions({ schema: shareResponseSchema })
  @ApiCreatedResponse({ standardSchema: shareResponseSchema })
  @ApiErrorResponse(
    HttpStatus.BAD_REQUEST,
    CommonErrorCode.REQUEST_VALIDATION,
    CommonMessages.REQUEST_VALIDATION,
    [{ field: 'markdown', message: 'Укажите markdown текст.' }],
  )
  @ApiErrorResponse(
    HttpStatus.INTERNAL_SERVER_ERROR,
    SharesErrorCode.SLUG_GENERATION_FAILED,
    SharesMessages.SLUG_GENERATION_FAILED,
  )
  @ApiErrorResponse(
    HttpStatus.INTERNAL_SERVER_ERROR,
    CommonErrorCode.INTERNAL_ERROR,
    CommonMessages.INTERNAL_ERROR,
  )
  public async createShare(
    @Body({ schema: createShareRequestSchema }) data: CreateShareRequest,
  ): Promise<DataEnvelope<Share>> {
    const share = await this._sharesService.createShare(data);

    return { data: share };
  }

  @Get(':slug')
  @SerializeOptions({ schema: shareResponseSchema })
  @ApiResponse({ status: 200, standardSchema: shareResponseSchema })
  @ApiErrorResponse(
    HttpStatus.NOT_FOUND,
    SharesErrorCode.NOT_FOUND,
    SharesMessages.NOT_FOUND,
  )
  @ApiErrorResponse(
    HttpStatus.INTERNAL_SERVER_ERROR,
    CommonErrorCode.INTERNAL_ERROR,
    CommonMessages.INTERNAL_ERROR,
  )
  public async getShare(
    @Param('slug') slug: string,
  ): Promise<DataEnvelope<Share>> {
    const share = await this._sharesService.getShareBySlug(slug);

    return { data: share };
  }
}
