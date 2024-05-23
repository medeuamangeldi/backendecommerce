import {
    Body,
    Controller,
    Post,
    UseGuards,
    Req,
  } from '@nestjs/common';
  import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
  import { CreateDeliveryInfoDto } from './dto/create-deliverinfo.dto';
  import { DeliveryInfoService } from './deliverInfo.service';
  import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
  import { Request } from 'express';
  
  @Controller('delivery')
  @ApiTags('delivery')
  export class CartController {
    constructor(private deliveryInfoService: DeliveryInfoService) {}
  
    @Post('delivery')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async createDeliveryByCart(@Body() createDeliveryInfoDto: CreateDeliveryInfoDto, @Req() req: Request) {
      let userId = req.user["id"];
      return await this.deliveryInfoService.createDeliveryByCart(createDeliveryInfoDto, userId);
    }
}