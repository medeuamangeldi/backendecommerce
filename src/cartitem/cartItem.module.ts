import { Module } from '@nestjs/common';
import { CartItemService } from './cartItem.service';
import { CartItemController } from './cartItem.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ModelModule } from 'src/model/model.module';

@Module({
  imports: [PrismaModule, ModelModule],
  providers: [CartItemService],
  controllers: [CartItemController],
  exports: [CartItemService],
})
export class CartItemModule {}