import { Injectable } from '@nestjs/common';
import { Share } from '@/generated/prisma/client';
import { PrismaService } from '../prisma';
import { CreateShareDto } from './dto/create-share.dto';

@Injectable()
export class SharesRepository {
  public constructor(private readonly prisma: PrismaService) {}

  public async createShare(data: CreateShareDto): Promise<Share> {
    return this.prisma.share.create({ data });
  }

  public async findBySlug(slug: string): Promise<Share | null> {
    return this.prisma.share.findUnique({ where: { slug } });
  }
}
