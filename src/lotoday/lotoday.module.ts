import { Module } from '@nestjs/common';
import { LotoDayService } from './lotoday.service';
import { LotoDayController } from './lotoday.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [LotoDayService],
  controllers: [LotoDayController],
  exports: [LotoDayService],
})
export class LotoDayModule {}