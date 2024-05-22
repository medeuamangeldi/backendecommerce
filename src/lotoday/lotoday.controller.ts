import {
    Controller,
    Get,
    UseGuards,
    Req,
    Patch,
    Body,
    Post,
  } from '@nestjs/common';
  import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
  import { LotoDayService } from './lotoday.service';
  import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
  import { Request } from 'express';
  import { Roles } from 'src/auth/roles/roles.decorator';
  import { RoleGuard } from 'src/auth/roles.guard';
  import { CreateLotoDayDto } from './dto/create-lotoday.dto';

  
  @Controller('lotoday')
  @ApiTags('lotoday')
  export class LotoDayController {
    constructor(private lotoDayService: LotoDayService) {}
    
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getLotteryTicket(@Req() req: Request) {
    return await this.lotoDayService.getActive();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  async createLotoDay(@Body() createLotoDayDto: CreateLotoDayDto){
    return await this.lotoDayService.CreateLotoDay(createLotoDayDto);
  }
}