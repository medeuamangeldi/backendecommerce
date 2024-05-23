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
  import { CreateCartItemDto } from './dto/create-cartitem.dto';
  import { CartItemService } from './cartItem.service';
  import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
  import { Request } from 'express';
  
  @Controller('cartitem')
  @ApiTags('cartitem')
  export class CartItemController {
    constructor(private cartItemService: CartItemService) {}
}