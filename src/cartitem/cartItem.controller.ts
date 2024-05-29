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
import { CreateCartItemDto } from './dto/create-cartitem.dto';
import { CartItemService } from './cartItem.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('cartitem')
@ApiTags('cartitem')
export class CartItemController {
  constructor(private cartItemService: CartItemService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async createCartItem(@Body() createCartItemDto: CreateCartItemDto) {
    return await this.cartItemService.creatCartItem(createCartItemDto);
  }

  // @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateCartItem(
    @Param('id') id: string,
    @Body() createCartItemDto: CreateCartItemDto,
  ) {
    return await this.cartItemService.updateCartItem(+id, createCartItemDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findUserCartItem(@Param('id') cartItemId: string) {
    return await this.cartItemService.findUserCartItem(+cartItemId);
  }
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteCart(@Param('id') cartItemId: string) {
    return await this.cartItemService.remove(+cartItemId);
  }
}
