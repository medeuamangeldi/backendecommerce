import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { CartItemService } from 'src/cartitem/cartItem.service';

@Injectable()
export class CartService {
  constructor(
    private prisma: PrismaService,
    private readonly cartItemService: CartItemService,
  ) {}

  async create(createCartDto: CreateCartDto) {
    try {
      const userId = createCartDto.userId;
      let cart: any = await this.prisma.cart.findFirst({ where: { userId } });
      if (!cart) {
        const data = { userId: userId };
        cart = await this.prisma.cart
          .create({ data })
          .then((res) => {
            return res;
          })
          .catch((err) => {
            console.log('err: ', err);
          });
      }
      let totalPriceNew: any;
      await this.cartItemService
        .create(cart.id, createCartDto)
        .then(async () => {
          cart = await this.prisma.cart.findFirst({
            where: { userId },
            select: { cartItems: true, id: true, totalPrice: true },
          });
          totalPriceNew = cart.cartItems.reduce(
            (acc, { totalPrice }) => acc + totalPrice,
            0,
          );
          cart = await this.prisma.cart.update({
            where: { id: cart.id },
            data: { totalPrice: totalPriceNew },
            select: {
              id: true,
              userId: true,
              totalPrice: true,
              cartItems: {
                select: {
                  id: true,
                  quantity: true,
                  totalPrice: true,
                  model: {
                    select: {
                      id: true,
                      name: true,
                      price: true,
                      deal: true,
                      photoUrls: true,
                    },
                  },
                },
              },
              deliveryInfo: true,
            },
          });
        });
      return cart;
    } catch (error) {
      throw new HttpException(error, 404);
    }
  }

  async findUserCart(userId: number) {
    try {
      const cart = await this.prisma.cart.findUnique({
        where: { userId },
        select: {
          id: true,
          userId: true,
          totalPrice: true,
          cartItems: {
            select: {
              id: true,
              quantity: true,
              totalPrice: true,
              model: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  deal: true,
                  photoUrls: true,
                },
              },
            },
          },
          deliveryInfo: true,
        },
      });
      if (!cart) {
        throw new HttpException('Cart not found', 404);
      }
      return cart;
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
