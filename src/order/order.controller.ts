import {
    Body,
    Controller,
    Get,
    Param,
    Delete,
    Post,
    UseGuards,
    Req,
  } from '@nestjs/common';
  import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
  import { CreateOrderDto } from './dto/create-order.dto';
  import { OrderService } from './order.service';
  import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
  import { Request } from 'express';
  
  @Controller('order')
  @ApiTags('order')
  export class OrderController {
    constructor(private orderService: OrderService) {}
  
    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async creatOrder(@Body() createOrderDto: CreateOrderDto, @Req() req: Request) {
      let userId = req.user["id"];
      return await this.orderService.create(createOrderDto, userId);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async getOrders(@Req() req: Request) {
      let userId = req.user["id"];
      return await this.orderService.getOrders(userId);
    }
}