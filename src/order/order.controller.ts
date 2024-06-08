import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Req,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
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

  @Post('callback')
  async resultUrlPayment(@Body() data: any) {
    await this.orderService.updateOrder(data);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getMyOrders(@Req() req: Request) {
    const userId = req.user['id'];
    return await this.orderService.getOrders(+userId);
  }

  @Get(':userId/user')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  async getOrders(@Param('userId') userId: string) {
    return await this.orderService.getOrders(+userId);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('ADMIN')
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'dateFrom', required: false })
  @ApiQuery({ name: 'dateTo', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'city', required: false })
  @ApiBearerAuth()
  async getAllOrders(
    @Query('search') search: string,
    @Query('dateFrom') dateFrom: Date,
    @Query('dateTo') dateTo: Date,
    @Query('status') status: string,
    @Query('city') city: string,
    @Query() { limit = 10, skip = 0 },
  ) {
    const payload = { search, dateFrom, dateTo, status, city, limit, skip };
    return await this.orderService.getAllOrders(payload);
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
