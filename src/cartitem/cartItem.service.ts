import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ModelService } from 'src/model/model.service';
import { CreateCartDto } from 'src/cart/dto/create-cart.dto';
import { CartItem } from '@prisma/client';

@Injectable()
export class CartItemService {
  constructor(
    private prisma: PrismaService,
    private readonly modelService: ModelService,
  ) {}

  async create( cartId: number, createCartDto: CreateCartDto) {
    try {
      let itemData: CartItem | null = await this.prisma.cartItem.findFirst({ where: { cartId: cartId, modelId: createCartDto.modelId } });
      let modelCart = await this.modelService.getModelById(createCartDto.modelId);
      
      if (itemData) {
        let quantity = itemData["quantity"] + createCartDto.quantity;
        let totalPrice = modelCart.price * quantity
        return await this.prisma.cartItem.update({
          where: {id: itemData["id"]},
          data: { quantity, totalPrice }
        });
      }else {
      let totalPrice = modelCart.price * createCartDto.quantity
      return await this.prisma.cartItem.create({
        data: {
          cartId: cartId, 
          modelId: createCartDto.modelId, 
          quantity: createCartDto.quantity,
          totalPrice: totalPrice
        }
      })
    }
    } catch (error) {
      throw new HttpException(error, 404);
    }
  }
  
  async findCartItemByCart(cartId: number) {
    try {
      return await this.prisma.cartItem.findMany({
        where: { cartId: cartId},
        include: { model: true },
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
