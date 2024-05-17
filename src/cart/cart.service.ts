import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCartDto) {
    try {
      return await this.prisma.cart.create({ data });
    } catch (error) {
      throw new HttpException(error, 404);
    }
  }
  async getCartsByUser(userId: number) {
    try {
      return await this.prisma.cart.findUnique({
        where: { userId },
      });
    } catch (error) {
      throw new HttpException(error, 404);
    }
  }
  async getCart(id: number) {
    const cart = await this.prisma.cart.findUnique({
      where: { id },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        cartItems: true,
        deliveryInfo: true,
      },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    return cart;
  }

  async update(id: number, data: UpdateCartDto) {
    try {
      return await this.prisma.cart.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new HttpException(error, 404);
    }
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
