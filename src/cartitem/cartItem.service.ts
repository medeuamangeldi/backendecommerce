import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ModelService } from 'src/model/model.service';
import { CreateCartDto } from 'src/cart/dto/create-cart.dto';
import { CreateCartItemDto } from './dto/create-cartitem.dto';
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


  async creatCartItem(data: CreateCartItemDto) {
    try {
      let modelCart = await this.modelService.getModelById(data.modelId);

      let itemData: CartItem | null = await this.prisma.cartItem.findFirst({ where: { cartId: data.cartId, modelId: data.modelId } });


      data.totalPrice = modelCart.price * data.quantity;

      let cart = await this.prisma.cart.findFirst({ where: { id:data.cartId } });
      let oldPrice = itemData ? itemData.totalPrice : 0;
      await this.prisma.cart.update({
        where: { id: data.cartId },
        data: { totalPrice: cart.totalPrice + data.totalPrice - oldPrice },
      });
      if (itemData){
        let quantity = data.quantity;
        let totalPrice = data.totalPrice
        return await this.prisma.cartItem.update({
          where: {id: itemData["id"]},
          data: { quantity, totalPrice }
        });
      }else{
        return await this.prisma.cartItem.create({ data });
      }
    } catch (error) {
      throw new HttpException(error, 404);
    }
  }

  async updateCartItem(id: number, data: CreateCartItemDto) {
    try {
      let modelCart = await this.modelService.getModelById(data.modelId);
      
      data.totalPrice = modelCart.price * data.quantity;
      return await this.prisma.cartItem.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new HttpException(error, 404);
    }
  }

  async findUserCartItem(cartItemId: number) {
    try {
      return await this.prisma.cartItem.findUnique({
        where: { id: cartItemId},
        include: { model: true },
      });
    } catch (error) {
      throw new HttpException(error, 404);
    }
  }
  
  async remove(id: number) {
    try {
      let cartItem =  await this.prisma.cartItem.delete({
        where: { id },
      });
      let cart = await this.prisma.cart.findFirst({ where: { id:cartItem.cartId } });

      await this.prisma.cart.update({
        where: { id: cartItem.cartId },
        data: { totalPrice: cart.totalPrice - cartItem.totalPrice },
      });

      console.log(cartItem)
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
