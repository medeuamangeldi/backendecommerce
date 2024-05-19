import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async create(dataItem: CreateCartDto, userId: number) {
    try {
      let data = {userId: userId}
      let cartId = await this.prisma.cart.create({ data });
      console.log(dataItem)

      let cartItems = await Promise.all(dataItem.data.map(async(item) => {
       await this.prisma.cartItem.create({
        data: {
          cartId: cartId.id, 
          modelId: item.modelID, 
          quantity: item.quantity
        }
      })
    }));
    await this.prisma.deliveryInfo.create({
      data: {
        cartId: cartId.id,
        fullName: dataItem.address.username,
        phoneNumber: dataItem.address.phone,
        selfPick: dataItem.address.selfPick,
        postalCode: dataItem.address.postalCode,
        cityId: dataItem.address.cityId,
        deliveryAddress: dataItem.address.deliveryAddress,
        comment: dataItem.address.comment,
        pickupUrl: dataItem.address.pickupUrl
      }
    })
  
    } catch (error) {
      throw new HttpException(error, 404);
    }
  }
  async findUserCart(userId: number) {
    try {
      return await this.prisma.cart.findUnique({
        where: { userId },
      });
    } catch (error) {
      throw new HttpException(error, 404);
    }
  }
  async getCartById(id: number) {
    const cart = await this.prisma.cart.findUnique({
      where: { id },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    return cart;
  }


  async remove(id: number) {
    try {
        return await this.prisma.cart.delete({
        where: { id },
        select: { id: true },
        });
    } catch (error) {
        throw new HttpException(error, 404);
    }
    }
}
