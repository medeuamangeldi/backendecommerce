import { Module } from '@nestjs/common';
import { GlobalConfigService } from './globalConfig.service';
import { GlobalConfigController } from './globalConfig.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrizeModule } from 'src/prize/prize.module';
import { LotoDayModule } from 'src/lotoday/lotoday.module';

@Module({
  imports: [PrismaModule],
  providers: [GlobalConfigService],
  controllers: [GlobalConfigController],
  exports: [GlobalConfigService],
})
export class GlobalConfigModule {}