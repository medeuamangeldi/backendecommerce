import {
  Body,
  Controller,
  Get,
  Param,
  Delete,
  Post,
  UseGuards,
  Req,
  Patch,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';
import { UpdateOrderDto } from './dto/update-order.dto';
import { RoleGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';

@Controller('order')
@ApiTags('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async creatOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Req() req: Request,
  ) {
    const userId = req.user['id'];
    return await this.orderService.create(createOrderDto, userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  async getOrders(@Req() req: Request) {
    const userId = req.user['id'];
    return await this.orderService.getOrders(userId);
  }

  @Patch(':id/trackingNumber')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  async addTrackingNumber(
    @Param('id') id: string,
    @Body() data: UpdateOrderDto,
  ) {
    return await this.orderService.addTrackingNumber(+id, data.trackingNumber);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  async updateStatus(@Param('id') id: string, @Body() data: UpdateOrderDto) {
    return await this.orderService.updateStatus(+id, data.status);
  }
}
