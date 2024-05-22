import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCartItemDto, CreateDeliveryInfo } from './dto/create-cart.dto';
import { CartItem } from '@prisma/client';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async create(dataItem: CreateCartItemDto, userId: number) {
    try {
      let cartId = await this.prisma.cart.findFirst({ where: { userId } });
      if (!cartId) {
        let data = {userId: userId}
        cartId = await this.prisma.cart.create({ data });
      }

      let itemData: CartItem | null = await this.prisma.cartItem.findFirst({ where: { cartId: cartId.id, modelId: dataItem.modelId } });
      if (itemData) {
        let quantity = itemData["quantity"] + dataItem.quantity;
        return await this.prisma.cartItem.update({
          where: {id: itemData["id"]},
          data: { quantity }
        });
      }else {
      return await this.prisma.cartItem.create({
        data: {
          cartId: cartId.id, 
          modelId: dataItem.modelId, 
          quantity: dataItem.quantity
        }
      })
    }
    } catch (error) {
      throw new HttpException(error, 404);
    }
  }

  async createDeliveryByCart(dataItem: CreateDeliveryInfo, userId: number) {
    try {
      let cartId = await this.prisma.cart.findFirst({ where: { userId } });
      if (!cartId) {
        throw new HttpException("Cart not found", 404)
      }
    await this.prisma.deliveryInfo.create({
      data: {
        cartId: cartId.id,
        fullName: dataItem.username,
        phoneNumber: dataItem.phone,
        selfPick: dataItem.selfPick,
        postalCode: dataItem.postalCode,
        cityId: dataItem.cityId,
        deliveryAddress: dataItem.deliveryAddress,
        comment: dataItem.comment,
        pickupUrl: dataItem.pickupUrl
      }
    })

    } catch (error) {
      throw new HttpException(error, 404);
    }
  }
  
  async findUserCart(userId: number) {
    try {
      let currentCart = await this.prisma.cart.findUnique({
        where: { userId },
      });
      if (!currentCart) {
        return [];
      }
      return await this.prisma.cartItem.findMany({
        where: { cartId: currentCart.id },
        include: { model: true },
      });
    } catch (error) {
      throw new HttpException(error, 404);
    }
  }

  async remove(userId: number) {
    try {
        return await this.prisma.cart.delete({
        where: { userId: userId },
        select: { id: true },
        });
    } catch (error) {
        throw new HttpException(error, 404);
    }
    }
  async getCarItemtByUserId(id: number) {
    try {
      return await this.prisma.cartItem.findMany({
        where: {cart: {userId: id}},
            include: { model: true }
      });
    } catch (error) {
      throw new HttpException(error, 404);
    }
  }
}
