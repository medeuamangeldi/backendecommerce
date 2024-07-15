import { Module } from '@nestjs/common';
import { PrizeService } from './prize.service';
import { PrizeController } from './prize.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MixpanelService } from 'src/mixpanel/mixpanel.service';

@Module({
  imports: [PrismaModule],
  providers: [PrizeService, MixpanelService],
  controllers: [PrizeController],
  exports: [PrizeService],
})
export class PrizeModule {}
