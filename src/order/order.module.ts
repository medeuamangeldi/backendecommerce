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

@Module({
  imports: [
    PrismaModule,
    CartModule,
    TicketModule,
    CartItemModule,
    GlobalConfigModule,
    ModelModule,
    HttpModule,
  ],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
