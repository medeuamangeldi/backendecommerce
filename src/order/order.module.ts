import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CartModule } from 'src/cart/cart.module';
import { CartItemModule } from 'src/cartitem/cartItem.module';
import { TicketModule } from 'src/ticket/ticket.module';
import { GlobalConfigModule } from 'src/globalConfig/globalConfig.module';
import { ModelModule } from 'src/model/model.module';
import { HttpModule } from '@nestjs/axios';
import { FilledSelfPickDateModule } from 'src/filled-self-pick-date/filled-self-pick-date.module';
import { MixpanelService } from 'src/mixpanel/mixpanel.service';

@Module({
  imports: [
    PrismaModule,
    CartModule,
    TicketModule,
    CartItemModule,
    GlobalConfigModule,
    ModelModule,
    HttpModule,
    FilledSelfPickDateModule,
  ],
  providers: [OrderService, MixpanelService],
  controllers: [OrderController],
})
export class OrderModule {}
