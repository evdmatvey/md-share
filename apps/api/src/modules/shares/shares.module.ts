import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma';
import { SharesController } from './shares.controller';
import { SharesRepository } from './shares.repository';
import { SharesService } from './shares.service';

@Module({
  imports: [PrismaModule],
  controllers: [SharesController],
  providers: [SharesService, SharesRepository],
})
export class SharesModule {}
