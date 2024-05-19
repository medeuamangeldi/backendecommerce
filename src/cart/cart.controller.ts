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
    async createCart(@Body() createCartDto: CreateCartDto, @Req() req: Request) {
      let userId = req.user["id"];
      return await this.cartService.create(createCartDto, userId);
    }

    @Get('/user/:userId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async findUserCart(@Param('userId') userId: string) {
    return await this.cartService.findUserCart(+userId);
  }

    @Get('/cart/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async getCartById(@Param('id') id: number) {
      return await this.cartService.getCartById(+id);
  }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async deleteCart(@Param('id') id: string) {
    return await this.cartService.remove(+id);
  }
}