import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDeliveryInfoDto } from './dto/create-deliverinfo.dto';

@Injectable()
export class DeliveryInfoService {
  constructor(private prisma: PrismaService) {}


  async createDeliveryByCart(createDeliveryInfoDto: CreateDeliveryInfoDto, userId: number) {
    try {
      let cartId = await this.prisma.cart.findFirst({ where: { userId } });
      if (!cartId) {
        throw new HttpException("Cart not found", 404)
      }
    await this.prisma.deliveryInfo.create({
      data: {
        cartId: cartId.id,
        fullName: createDeliveryInfoDto.username,
        phoneNumber: createDeliveryInfoDto.phone,
        selfPick: createDeliveryInfoDto.selfPick,
        postalCode: createDeliveryInfoDto.postalCode,
        cityId: createDeliveryInfoDto.cityId,
        deliveryAddress: createDeliveryInfoDto.deliveryAddress,
        comment: createDeliveryInfoDto.comment,
        pickupUrl: createDeliveryInfoDto.pickupUrl
      }
    })

    } catch (error) {
      throw new HttpException(error, 404);
    }
  }
}
