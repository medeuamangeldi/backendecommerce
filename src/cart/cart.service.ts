import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { CartItemService } from 'src/cartitem/cartItem.service';

@Injectable()
export class CartService {
    constructor(private prisma: PrismaService,
    private readonly cartItemService: CartItemService,
  ) {}

  async create(createCartDto: CreateCartDto) {
    try {
      let userId = createCartDto.userId;
      let cartId = await this.prisma.cart.findFirst({ where: { userId } });
      if (!cartId) {
        let data = {userId: userId}
        cartId = await this.prisma.cart.create({ data });
      }
      let cartItem = await this.cartItemService.create(cartId.id, createCartDto)
      let totalPrice = cartItem.totalPrice + cartId.totalPrice
      await this.prisma.cart.update({
        where: {id: cartId.id}, 
        data: {totalPrice: totalPrice}})

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
      return await this.cartItemService.findCartItemByCart(currentCart.id);
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
}
