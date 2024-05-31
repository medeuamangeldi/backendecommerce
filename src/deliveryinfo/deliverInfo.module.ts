import { Module } from '@nestjs/common';
import { DeliveryInfoService } from './deliverInfo.service';
import { CartController } from './deliverInfo.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [DeliveryInfoService],
  controllers: [CartController],
  exports: [DeliveryInfoService],
})
export class DeliverInfoModule {}
