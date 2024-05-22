import {
    Controller,
    Get,
    UseGuards,
    Req,
    Patch,
    Body,
  } from '@nestjs/common';
  import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
  import { PrizeService } from './prize.service';
  import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
  import { Request } from 'express';
  import { Roles } from 'src/auth/roles/roles.decorator';
  import { RoleGuard } from 'src/auth/roles.guard';

  
  @Controller('prize')
  @ApiTags('prize')
  export class PrizeController {
    constructor(private prizeService: PrizeService) {}
    
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getPrizeByUser(@Req() req: Request) {
    let userId = req.user["id"];
    return await this.prizeService.getPriseByUser(userId);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, RoleGuard) 
  @Roles('ADMIN')
  @ApiBearerAuth()
  async getAllPrizes() {
    return await this.prizeService.getAllPrizes();
  }
}