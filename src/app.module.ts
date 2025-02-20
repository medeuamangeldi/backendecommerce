import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { ModelModule } from './model/model.module';
import { OrderModule } from './order/order.module';
import { CityModule } from './city/city.module';
import { ConfigModule } from '@nestjs/config';
import { CartModule } from './cart/cart.module';
import { DeliverInfoModule } from './deliveryinfo/deliverInfo.module';
import { CartItemModule } from './cartitem/cartItem.module';
import { TicketModule } from './ticket/ticket.module';
import { FavoriteModule } from './favorite/favorite.module';
import { MinioService } from './minio/minio.service';
import { FaqModule } from './faq/faq.module';
import { FilledSelfPickDateModule } from './filled-self-pick-date/filled-self-pick-date.module';
import { MixpanelService } from './mixpanel/mixpanel.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    AuthModule,
    ProfileModule,
    CategoryModule,
    ProductModule,
    ModelModule,
    CartModule,
    OrderModule,
    TicketModule,
    CityModule,
    FavoriteModule,
    CartItemModule,
    DeliverInfoModule,
    FaqModule,
    FilledSelfPickDateModule,
  ],
  controllers: [AppController],
  providers: [AppService, MinioService, MixpanelService],
})
export class AppModule {}
