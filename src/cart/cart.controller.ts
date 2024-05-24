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
import { CreateCartDto } from './dto/create-cart.dto';
import { CartService } from './cart.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('cart')
@ApiTags('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async createCart(@Body() createCartDto: CreateCartDto) {
    return await this.cartService.create(createCartDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findUserCart(@Req() req: Request) {
    const userId = req.user['id'];
    return await this.cartService.findUserCart(userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteCart(@Param('id') id: string) {
    return await this.cartService.remove(+id);
  }
}
