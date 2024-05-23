import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CartService } from 'src/cart/cart.service';
import { CartItemService } from 'src/cartitem/cartItem.service';
import { Order } from '@prisma/client';
import { TicketService } from 'src/ticket/ticket.service';

@Injectable()
export class OrderService {
    readonly ticketPrice: number = 3000; // Price of a lottery ticket
    constructor(
        private prisma: PrismaService,
        private readonly cartService: CartService,
        private readonly cartItemService: CartItemService,
        private readonly ticketService: TicketService,
    ) {}
  async create(payStatus: CreateOrderDto, userId: number) {
    try {
        let cart = await this.cartItemService.getCarItemtByUserId(userId)
        if (cart.length === 0){
            throw new HttpException('Cart is empty', HttpStatus.BAD_REQUEST);
        }
        let totalCartPriceDeal = cart
        .filter(item => item.model.deal === true)
        .reduce((sum, item) => sum + item.model.price * item.quantity, 0);

        let totalCartPrice = cart
        .reduce((sum, item) => sum + item.model.price * item.quantity, 0);

        let order: Order;
        if (payStatus.payStatus === true) {
            order = await this.prisma.order.create({data: {
                totalPrice: totalCartPrice,
                userId: userId,
                status: "PROCESSING",
            }});
            
            const countTicket = Math.floor(totalCartPriceDeal / this.ticketPrice);
            let myTicket = await this.ticketService.CreateLotteryTicket(userId, countTicket); // Get lottery tickets
            
        }else {
            throw new HttpException("Payment failed", 400);
        }        
        await this.prisma.cartItem.updateMany({
            where: {cart: {userId: userId}},
            data: {orderId: order["id"]},
        });
        await this.prisma.deliveryInfo.updateMany({
            where: {cart: {userId: userId}}, 
            data: {orderId: order["id"]}});

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
                where: {userId: userId},
                include: {
                    cartItems: {
                        include: {
                            model: true,
                        },
                    },
                    deliveryInfo: true,
                },
            });
        } catch (error) {
            throw new HttpException(error, 500);
        }
    }
}