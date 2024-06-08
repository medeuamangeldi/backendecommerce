import {
  HttpException,
  Injectable,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CartService } from 'src/cart/cart.service';
import { CartItemService } from 'src/cartitem/cartItem.service';
import { Order } from '@prisma/client';
import { TicketService } from 'src/ticket/ticket.service';
import { GlobalConfigService } from 'src/globalConfig/globalConfig.service';
import { OrderStatus } from './dto/update-order.dto';
import { ModelService } from 'src/model/model.service';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private readonly cartService: CartService,
    private readonly cartItemService: CartItemService,
    private readonly ticketService: TicketService,
    private readonly globalConfigService: GlobalConfigService,
    private readonly modelService: ModelService,
  ) {}
  async create(payStatus: CreateOrderDto, userId: number) {
    const GC = await this.globalConfigService.getIsBuyActive();
    if (GC.isBuyActive === false) {
      throw new ForbiddenException('Buying is not active');
    }

    try {
      const cartItems = await this.cartItemService.getCarItemtByUserId(userId);
      if (cartItems.length === 0) {
        throw new HttpException('Cart is empty', HttpStatus.BAD_REQUEST);
      }
      const totalCartPriceDeal = cartItems
        .filter((item) => item.model.deal === true)
        .reduce((sum, { totalPrice }) => sum + totalPrice, 0);

      const totalCartPrice = cartItems.reduce(
        (sum, { totalPrice }) => sum + totalPrice,
        0,
      );

      let order: Order;
      if (payStatus.payStatus === true) {
        order = await this.prisma.order
          .create({
            data: {
              totalPrice: totalCartPrice,
              userId: userId,
              status: 'PAYMENT_PENDING',
            },
          })
          .then((order) => {
            cartItems.forEach(async (cartItem: any) => {
              await this.modelService.decrementStockCount(
                cartItem.modelId,
                cartItem.quantity,
              );
            });
            return order;
          });

        const GC = await this.globalConfigService.getIsDealActive();

        if (GC.isDealActive === true) {
          const ticketPriceData =
            await this.globalConfigService.getTicketPrice();
          const countTicket = Math.floor(
            totalCartPriceDeal / ticketPriceData.ticketPrice,
          );
          await this.ticketService.CreateLotteryTicket(userId, countTicket); // Get lottery tickets
        }
      } else {
        throw new HttpException('Payment failed', 400);
      }
      await this.prisma.cartItem.updateMany({
        where: { cart: { userId: userId } },
        data: { orderId: order['id'] },
      });
      await this.prisma.deliveryInfo.updateMany({
        where: { cart: { userId: userId } },
        data: { orderId: order['id'] },
      });

      this.cartService.remove(userId); // Remove cart
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error, 500);
    }
  }

  async getOrders(userId: number) {
    try {
      return await this.prisma.order.findMany({
        where: { userId: userId },
        select: {
          id: true,
          userId: true,
          user: true,
          trackingNumber: true,
          cartItems: {
            select: {
              id: true,
              model: true,
              quantity: true,
              totalPrice: true,
            },
          },
          deliveryInfo: true,
          createdAt: true,
          totalPrice: true,
          status: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async getAllOrders(payload: any) {
    try {
      const { search, dateFrom, dateTo, status, city, limit, skip } = payload;
      const where = {
        OR: [
          { user: { phoneNumber: { contains: search } } },
          { user: { profile: { firstName: { contains: search } } } },
          { user: { profile: { lastName: { contains: search } } } },
        ],
        AND: [
          dateFrom ? { createdAt: { gte: dateFrom } } : {},
          dateTo ? { createdAt: { lte: dateTo } } : {},
          status ? { status: { equals: status } } : {},
          city
            ? {
                OR: [
                  { deliveryInfo: { city: { nameRu: { contains: city } } } },
                  { deliveryInfo: { city: { nameKz: { contains: city } } } },
                  { deliveryInfo: { city: { nameEn: { contains: city } } } },
                ],
              }
            : {},
        ],
      };

      return await this.prisma.order.findMany({
        where: where,
        select: {
          user: {
            select: {
              phoneNumber: true,
              isActive: true,
              profile: { select: { firstName: true, lastName: true } },
            },
          },
          trackingNumber: true,
          cartItems: {
            select: {
              id: true,
              model: true,
              quantity: true,
              totalPrice: true,
            },
          },
          deliveryInfo: true,
          createdAt: true,
          totalPrice: true,
          status: true,
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: skip,
      });
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async addTrackingNumber(orderId: number, trackingNumber: string) {
    try {
      return await this.prisma.order.update({
        where: { id: orderId },
        data: { trackingNumber: trackingNumber },
      });
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async updateStatus(orderId: number, status: OrderStatus) {
    try {
      return await this.prisma.order.update({
        where: { id: orderId },
        data: { status: status },
      });
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async updateOrder(data: any) {
    const {
      pg_order_id,
      pg_result,
      pg_payment_id,
      pg_failure_description,
    }: any = data;

    if (!pg_order_id || !pg_result || !pg_payment_id) {
      return;
    }

    try {
      const order = await this.prisma.order.update({
        where: { id: +pg_order_id },
        data: {
          paymentId: pg_payment_id,
          paymentFailureReason: pg_result === '0' ? pg_failure_description : '',
          status: pg_result === '0' ? 'PAYMENT_PENDING' : 'PROCESSING',
        },
      });
      console.log(order);
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
}
