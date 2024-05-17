import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Delete,
    Post,
    UseGuards,
  } from '@nestjs/common';
  import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
  import { CreateCartDto } from './dto/create-cart.dto';
  import { CartService } from './cart.service';
  import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
  import { RoleGuard } from 'src/auth/roles.guard';
  import { Roles } from 'src/auth/roles/roles.decorator'; 
  
  @Controller('cart')
  @ApiTags('cart')
  export class CartController {
    constructor(private cartService: CartService) {}
  
    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async create(@Body() createProductDto: CreateCartDto) {
        return await this.cartService.create(createProductDto);
    }

    @Get('/user/:userId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async findUserCarts(@Param('userId') userId: string) {
    return await this.cartService.getCartsByUser(+userId);
  }

    @Get('/cart/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async getCartById(@Param('id') id: number) {
      return await this.cartService.getCart(+id);
  }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles('ADMIN')
    @ApiBearerAuth()
    async deleteCart(@Param('id') id: string) {
    return await this.cartService.remove(+id);
  }
}