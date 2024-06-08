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
import { HttpService } from '@nestjs/axios';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const md5 = require('md5');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const parseString = require('xml2js').parseString;

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private readonly cartService: CartService,
    private readonly cartItemService: CartItemService,
    private readonly ticketService: TicketService,
    private readonly globalConfigService: GlobalConfigService,
    private readonly modelService: ModelService,
    private readonly httpService: HttpService,
  ) {}
  async create(payStatus: CreateOrderDto, userId: number) {
    const GC = await this.globalConfigService.getIsBuyActive();
    if (GC.isBuyActive === false) {
      throw new ForbiddenException('Buying is not active');
    }

    const deliveryInfo = await this.prisma.deliveryInfo.findFirst({
      where: { cart: { userId: userId } },
      select: { selfPick: true, cart: { select: { userId: true } } },
    });

    try {
      const cartItems = await this.cartItemService.getCarItemtByUserId(userId);
      if (cartItems.length === 0) {
        throw new HttpException('Cart is empty', HttpStatus.BAD_REQUEST);
      }

      const totalCartPrice = cartItems.reduce(
        (sum, { totalPrice }) => sum + totalPrice,
        0,
      );

      let totalForDeliveryPrice = 0;

      if (
        deliveryInfo?.selfPick === false &&
        deliveryInfo?.cart?.userId === userId
      ) {
        const totalKgForDelivery = cartItems.reduce(
          (sum, { model, quantity }) => {
            return sum + model.weightInKg * quantity;
          },
          0,
        );
        const deliveryPricePerKg =
          await this.globalConfigService.getDeliveryPricePerKg();
        totalForDeliveryPrice =
          totalKgForDelivery * deliveryPricePerKg.deliveryPricePerKg;
      }

      let order: Order;
      let redirectUrl: string;
      if (payStatus.payStatus === true) {
        order = await this.prisma.order
          .create({
            data: {
              totalPrice: totalCartPrice + totalForDeliveryPrice,
              userId: userId,
              status: 'PAYMENT_PENDING',
            },
          })
          .then(async (res) => {
            redirectUrl = await this.generateSigAndInitPayment({
              pg_order_id: res.id,
              pg_amount: res.totalPrice,
            });
            return res;
          });
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

      return {
        order: order,
        redirectUrl: redirectUrl,
      };
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

      if (pg_result === '1') {
        const cartItems = await this.cartItemService.getCarItemtOrderByUserId(
          order.id,
        );
        cartItems.forEach(async (cartItem: any) => {
          await this.modelService.decrementStockCount(
            cartItem.modelId,
            cartItem.quantity,
          );
        });

        const GC = await this.globalConfigService.getIsDealActive();

        if (GC.isDealActive === true) {
          const totalCartPriceDeal = cartItems
            .filter((item) => item.model.deal === true)
            .reduce((sum, { totalPrice }) => sum + totalPrice, 0);

          const ticketPriceData =
            await this.globalConfigService.getTicketPrice();
          const countTicket = Math.floor(
            totalCartPriceDeal / ticketPriceData.ticketPrice,
          );
          await this.ticketService.CreateLotteryTicket(
            order.userId,
            countTicket,
          ); // Get lottery tickets
        }
      }
      console.log(data);
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async generateSigAndInitPayment({ pg_order_id, pg_amount }: any) {
    const pg_merchant_id: any = process.env.PG_MERCHANT_ID;
    const secret_key: any = process.env.PG_MERCHANT_SECRET;
    const salt: any = process.env.PG_MERCHANT_SALT;
    const testing_mode = process.env.PG_TESTING_MODE;

    const request: any = {
      pg_order_id: `${pg_order_id}`,
      pg_merchant_id: pg_merchant_id,
      pg_amount: `${pg_amount}`,
      pg_salt: salt,
      pg_currency: 'KZT',
      pg_testing_mode: testing_mode,
      pg_language: 'ru',
      pg_description: `Оплата заказа №${pg_order_id}`,
    };

    /**
     * Function to flatten a multi-dimensional array
     */
    function makeFlatParamsArray(arrParams: any, parentName = '') {
      const arrFlatParams: any = {};
      let i = 0;
      // eslint-disable-next-line prefer-const
      for (let key in arrParams) {
        i++;
        const name = parentName + key + i.toString().padStart(3, '0');
        if (Array.isArray(arrParams[key])) {
          Object.assign(
            arrFlatParams,
            makeFlatParamsArray(arrParams[key], name),
          );
          continue;
        }
        arrFlatParams[name] = arrParams[key].toString();
      }
      return arrFlatParams;
    }

    // Convert request object to a flat array
    const requestForSignature = makeFlatParamsArray(request);

    // Generate signature
    const sortedKeys = Object.keys(requestForSignature).sort();
    const signatureData = sortedKeys.map((key) => requestForSignature[key]);
    signatureData.unshift('init_payment.php'); // Add script name to the beginning
    signatureData.push(secret_key); // Add secret key to the end
    request['pg_sig'] = md5(signatureData.join(';')); // Generated signature

    console.log('request', request);

    const requestPaymentResponse = await this.doNestJSAxiosSend(request);

    console.log('requestPaymentResponse', requestPaymentResponse);
    // console.log('requestPaymentResponse?.data', requestPaymentResponse?.data);

    const extractRedirectUrl = (xmlResponse: string): Promise<string> => {
      return new Promise((resolve, reject) => {
        parseString(xmlResponse, (err: any, result: any) => {
          if (err) {
            reject(err);
          } else {
            try {
              const redirectUrl = result.response.pg_redirect_url[0];
              resolve(redirectUrl);
            } catch (error) {
              reject(error);
            }
          }
        });
      });
    };

    let redirectUrl = '';

    await extractRedirectUrl(requestPaymentResponse)
      .then((redUrl) => {
        redirectUrl = redUrl;
        // Now you can use redirectUrl in your Next.js project
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    return redirectUrl;
  }

  async doNestJSAxiosSend(body: any) {
    const uri = process.env.PG_PAYMENT_URL;
    try {
      const response = await fetch(uri, {
        method: 'post',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.text();

      return data;
    } catch (error) {
      console.error(error);
    }
  }
}
