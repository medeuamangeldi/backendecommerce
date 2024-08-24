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
import { FilledSelfPickDateService } from 'src/filled-self-pick-date/filled-self-pick-date.service';
import { CreateFilledSelfPickDateDto } from 'src/filled-self-pick-date/dto/create-filledSelfPickDate.dto';
import { MixpanelService } from 'src/mixpanel/mixpanel.service';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const crypto = require('crypto');
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const md5 = require('md5');
// // eslint-disable-next-line @typescript-eslint/no-var-requires
// const parseString = require('xml2js').parseString;

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
    private readonly filledSelfPickDateService: FilledSelfPickDateService,
    private readonly mixpanelService: MixpanelService,
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
              model: {
                select: {
                  id: true,
                  name: true,
                  photoUrls: true,
                  price: true,
                  deal: true,
                  inStockCount: true,
                  weightInKg: true,
                  descriptionEn: true,
                  descriptionKz: true,
                  descriptionRu: true,
                  detailedDescriptionEn: true,
                  detailedDescriptionKz: true,
                  detailedDescriptionRu: true,
                  createdAt: true,
                  updatedAt: true,
                  productId: true,
                  product: true,
                },
              },
              quantity: true,
              totalPrice: true,
            },
          },
          deliveryInfo: true,
          createdAt: true,
          totalPrice: true,
          status: true,
          paymentFailureReason: true,
          paymentId: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async getAllOrders(payload: any) {
    try {
      const {
        search,
        dateFrom,
        dateTo,
        status,
        city,
        limit,
        skip,
        pickupDate,
        deliveryType,
        filialId,
      } = payload;
      const where = {
        OR: [
          { user: { phoneNumber: { contains: search } } },
          { user: { profile: { firstName: { contains: search } } } },
          { user: { profile: { lastName: { contains: search } } } },
        ],
        AND: [
          deliveryType === '0'
            ? { deliveryInfo: { selfPick: { equals: false } } }
            : deliveryType === '1'
            ? { deliveryInfo: { selfPick: { equals: true } } }
            : {},
          dateFrom ? { createdAt: { gte: dateFrom } } : {},
          dateTo ? { createdAt: { lte: dateTo } } : {},
          status ? { status: { equals: status } } : {},
          pickupDate ? { deliveryInfo: { selfPickDate: pickupDate } } : {},
          filialId ? { deliveryInfo: { filialId: +filialId } } : {},
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
          id: true,
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
              model: {
                select: {
                  id: true,
                  name: true,
                  photoUrls: true,
                  price: true,
                  deal: true,
                  inStockCount: true,
                  weightInKg: true,
                  descriptionEn: true,
                  descriptionKz: true,
                  descriptionRu: true,
                  detailedDescriptionEn: true,
                  detailedDescriptionKz: true,
                  detailedDescriptionRu: true,
                  createdAt: true,
                  updatedAt: true,
                  productId: true,
                  product: true,
                },
              },
              quantity: true,
              totalPrice: true,
            },
          },
          deliveryInfo: {
            select: {
              id: true,
              fullName: true,
              phoneNumber: true,
              selfPick: true,
              postalCode: true,
              deliveryAddress: true,
              comment: true,
              pickupUrl: true,
              createdAt: true,
              updatedAt: true,
              selfPickDate: true,
              city: {
                select: {
                  nameEn: true,
                  nameKz: true,
                  nameRu: true,
                  pickupUrls: true,
                },
              },
            },
          },
          createdAt: true,
          totalPrice: true,
          status: true,
          paymentFailureReason: true,
          paymentId: true,
        },
        orderBy: { createdAt: 'desc' },
        take: +limit,
        skip: +skip,
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
    const encodedData = data?.data;
    const decodedData = Buffer.from(encodedData, 'base64').toString('utf8');
    const parsedData = JSON.parse(decodedData);
    console.log('parsedData: ', parsedData);
    const { order_id, payment_id, error_code }: any = parsedData;
    console.log('order_id: ', typeof order_id);
    console.log('payment_id: ', typeof payment_id);
    console.log('error_code: ', typeof error_code);

    const handleErrors = (error_code: string) => {
      switch (error_code) {
        case 'provider_server_error':
          return 'Ошибка на стороне банка-эквайера';
        case 'provider_common_error':
          return 'Ошибка на стороне сервера банка-эквайера';
        case 'provider_time_out':
          return 'Ошибка на стороне банка-эквайера';
        case 'provider_incorrect_response_format':
          return 'Ошибка на стороне сервера банка-эквайера';
        case 'ov_server_error':
          return 'Ошибка на стороне сервера';
        case 'ov_routes_unavailable':
          return 'Ошибка обработки платежа';
        case 'ov_send_otp_error':
          return 'Некорректный проверочный код.';
        case 'ov_incorrect_otp':
          return 'Некорректный проверочный код.';
        case 'ov_not_need_approve_status':
          return 'Ошибка обработки платежа';
        case 'ov_payment_method_incorrect':
          return 'Некорректный метод платежа';
        case 'ov_payment_type_incorrect':
          return 'Некорректный тип платежа';
        case 'ov_create_operation_error':
          return 'Ошибка при создании платежа';
        case 'ov_confirm_payment_error':
          return 'Ошибка при подтверждении платежа';
        case 'ov_cancel_payment_error':
          return 'Ошибка при отмене платежа';
        case 'ov_entity_not_found':
          return 'Сущность не найдена';
        case 'ov_entity_duplicate':
          return 'Сущность задублирована';
        case 'ov_payment_not_found':
          return 'Платеж не найден';
        case 'ov_payment_expired':
          return 'Истекло время жизни платежа.';
        case 'ov_payment_already_processed':
          return 'Платеж уже обработан';
        case 'ov_operation_not_found':
          return 'Операция не найдена';
        case 'ov_card_not_found':
          return 'Карта не найдена';
        case 'ov_card_incorrect_data':
          return 'Некорректные данные карты';
        case 'ov_limit_payment_amount_min':
          return 'Сумма платежа меньше минимальной';
        case 'ov_limit_payment_amount':
          return 'Превышение лимита платежа';
        case 'ov_limit_payments_count':
          return 'Превышение лимита платежей';
        case 'ov_limit_payments_daily_amount':
          return 'Превышение лимита платежей в день';
        case 'ov_limit_payments_monthly_amount':
          return 'Превышение лимита платежей в месяц';
        case 'ov_limit_payments_daily_count':
          return 'Превышение лимита платежей в день';
        case 'ov_limit_payments_monthly_count':
          return 'Превышение лимита платежей в месяц';
        case 'ov_commission_incorrect':
          return 'Некорректная комиссия';
        case 'ov_refund_amount_exceeded':
          return 'Превышение суммы возврата';
        case 'ov_refund_not_permitted':
          return 'Возврат запрещен';
        case 'ov_merchant_balance_insufficient':
          return 'Недостаточно средств на счете Магазина';
        case 'ov_merchant_balance_not_found':
          return 'Счет Магазина не найден';
        case 'ov_merchant_not_found':
          return 'Магазин не найден';
        case 'ov_not_two_stage_payment':
          return 'Ошибка обработки платежа';
        case 'ov_clear_amount_exceeded':
          return 'Ошибка процессинга платежа';
        case 'ov_anti_fraud_rejected':
          return 'Заблокировано антифрод системой';
        case 'ov_anti_fraud_internal_error':
          return 'Карта не прошла проверку в системе антифрод.';
        case 'ov_anti_fraud_time_out':
          return 'Карта не прошла проверку в системе антифрод.';
        case 'ov_payment_lock':
          return 'Платеж заблокирован';
        case 'ov_balance_locked':
          return 'Выплатные балансы заблокированные';
        case 'provider_card_incorrect':
          return 'Неверный формат карты';
        case 'provider_logic_error':
          return 'Неизвестная ошибка.';
        case 'provider_card_expired':
          return 'Истек срок действия карты';
        case 'provider_anti_fraud_error':
          return 'Платеж отклонен антифрод системой';
        case 'provider_not_permitted_operation':
          return 'операция запрещена';
        case 'provider_card_not_found':
          return 'Карта не найдена';
        case 'provider_insufficient_balance':
          return 'Недостаточно средств на карте';
        case 'provider_send_otp_error':
          return 'ошибка отправки OTP';
        case 'provider_incorrect_otp_error':
          return 'неверный OTP';
        case 'provider_abonent_not_found':
          return 'абонент не найден';
        case 'provider_limit_error':
          return 'Сумма превышает лимит на оплату в интернете.';
        case 'provider_abonent_inactive':
          return 'абонент не активен';
        case 'provider_confirm_payment_error':
          return 'ошибка подтверждения платежа';
        case 'provider_cancel_payment_error':
          return 'ошибка отмены платежа';
        case 'provider_refund_payment_error':
          return 'ошибка возврата платежа';
        case 'provider_mpi_default_error':
          return 'ошибка MPI';
        case 'provider_mpi_3ds_error':
          return 'ошибка 3DS';
        case 'provider_common_incorrect':
          return 'общая ошибка провайдера';
        case 'provider_recurrent_error':
          return 'ошибка рекуррентного платежа';
        case 'mpi_default_error':
          return 'ошибка MPI';
        case 'mpi_3ds_error':
          return 'ошибка 3DS';
        case 'ov_email_required':
          return 'Не заполнено поле email';
        default:
          return 'Неизвестная ошибка.';
      }
    };

    try {
      const order = await this.prisma.order.update({
        where: { id: +order_id },
        data: {
          paymentId: payment_id,
          paymentFailureReason: !!error_code ? handleErrors(error_code) : '',
          status: !!error_code ? 'PAYMENT_PENDING' : 'PROCESSING',
        },
        select: {
          deliveryInfo: true,
          userId: true,
          id: true,
          totalPrice: true,
        },
      });

      if (!!error_code) {
        this.mixpanelService.track('PAYMENT_FAILED', {
          distinct_id: order.userId,
          orderId: order.id,
          totalPrice: order.totalPrice,
          reason: error_code,
        });
      }

      if (!error_code) {
        const cartItems = await this.cartItemService.getCarItemtOrderByUserId(
          order.id,
        );
        cartItems.forEach(async (cartItem: any) => {
          await this.modelService.decrementStockCount(
            cartItem.modelId,
            cartItem.quantity,
          );
          this.mixpanelService.track('MODEL_SOLD', {
            distinct_id: order.userId,
            modelName: cartItem.model.name,
            modelPrice: cartItem.model.price,
            modelProduct: cartItem.model?.product?.nameRu,
            modelCategory: cartItem.model?.category?.nameRu,
            quantity: cartItem.quantity,
            selfPick: order.deliveryInfo?.selfPick,
            deal: cartItem.model.deal,
            address: order.deliveryInfo?.selfPick
              ? order.deliveryInfo?.pickupUrl
              : order.deliveryInfo?.deliveryAddress,
          });
          this.mixpanelService.peopleIncrement(`${order.userId}`, {
            models_purchased: cartItem.quantity,
          });
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
          this.mixpanelService.peopleIncrement(`${order.userId}`, {
            tickets_received: countTicket,
          });
        }

        if (order.deliveryInfo?.selfPick === true) {
          const totalItems = cartItems.reduce(
            (sum, { quantity }) => sum + quantity,
            0,
          );

          const existingFilledDate =
            await this.filledSelfPickDateService.findOneByDate(
              order.deliveryInfo.selfPickDate,
            );
          const gcSelfPickLimit =
            await this.globalConfigService.getSelfPickLimit();
          if (existingFilledDate) {
            const currentTotalItems = existingFilledDate.count;

            if (
              currentTotalItems + totalItems >=
              gcSelfPickLimit.selfPickLimit
            ) {
              await this.filledSelfPickDateService.update(
                existingFilledDate.id,
                {
                  isFilled: true,
                },
              );
            }
            await this.filledSelfPickDateService.increment(
              existingFilledDate.id,
              totalItems,
            );
          } else {
            const data: CreateFilledSelfPickDateDto = {
              date: order.deliveryInfo.selfPickDate,
              isFilled: totalItems >= gcSelfPickLimit.selfPickLimit,
              count: totalItems,
            };
            await this.filledSelfPickDateService.create(data);
          }
        }
      }
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async generateSigAndInitPayment({ pg_order_id, pg_amount }: any) {
    const secret_key = process.env.OV_SECRET_KEY;

    const items = [
      {
        merchant_id: process.env.OV_MID,
        service_id: process.env.OV_SID,
        merchant_name: process.env.OV_MERCHANT_NAME,
        name: 'Товар',
        quantity: 1,
        amount_one_pcs: pg_amount,
        amount_sum: pg_amount,
      },
    ];
    const data = {
      amount: pg_amount,
      currency: 'KZT',
      order_id: pg_order_id.toString(),
      description: 'description_1',
      payment_type: process.env.OV_PAYMENT_TYPE,
      payment_method: process.env.OV_PAYMENT_METHOD,
      items: items,
      email: process.env.OV_EMAIL,
      payment_lifetime: parseInt(process.env.OV_LIFETIME),
      callback_url: process.env.OV_CALLBACK_URL,
    };

    // Преобразуем объект в строку JSON
    const dataJson = JSON.stringify(data);

    // Кодируем строку JSON в base64
    const base64Data = Buffer.from(dataJson).toString('base64');

    // Генерация HMAC-подписи
    const hmac = crypto.createHmac(process.env.OV_HASH_METHOD, secret_key);
    hmac.update(base64Data);
    const sign = hmac.digest('hex');

    // Создаем объект запроса
    const obj = {
      data: base64Data,
      sign: sign,
    };

    let requestPaymentResponse: any = await this.doNestJSAxiosSend(obj);

    requestPaymentResponse = JSON.parse(requestPaymentResponse);

    if (requestPaymentResponse?.success === false) {
      throw new HttpException(requestPaymentResponse?.error_msg, 400);
    }

    const responseDataEncoded = requestPaymentResponse?.data;
    let responseData: any = Buffer.from(responseDataEncoded, 'base64').toString(
      'utf8',
    );

    responseData = JSON.parse(responseData);

    const redirectUrl = responseData?.payment_page_url;

    if (!redirectUrl) {
      throw new HttpException('Payment failed', 400);
    }

    return redirectUrl;
  }

  async payFailedOrder(orderId: number) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      select: { userId: true, totalPrice: true },
    });

    if (!order) {
      throw new HttpException('Order not found', 404);
    }

    return await this.generateSigAndInitPayment({
      pg_order_id: orderId,
      pg_amount: order.totalPrice,
    });
  }

  async doNestJSAxiosSend(body: any) {
    const uri = process.env.OV_API_URL;
    const api_key = process.env.OV_API_KEY;
    const bearer = Buffer.from(api_key).toString('base64');
    try {
      const response = await fetch(`${uri}/payment/create`, {
        method: 'post',
        credentials: 'include',
        body: JSON.stringify(body),
        headers: {
          Authorization: `Bearer ${bearer}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.text();

      return data;
    } catch (error) {
      console.error(error);
    }
  }
}
