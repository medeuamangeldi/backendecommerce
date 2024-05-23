import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CartModule } from 'src/cart/cart.module';
import { CartItemModule } from 'src/cartitem/cartItem.module';
import { TicketModule } from 'src/ticket/ticket.module';

@Module({
  imports: [PrismaModule, CartModule, TicketModule, CartItemModule],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}