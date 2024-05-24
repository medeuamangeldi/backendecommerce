import {
    Controller,
    Get,
    UseGuards,
    Req,
    Patch,
    Body,
    Param,
    Delete,
  } from '@nestjs/common';
  import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
  import { PrizeService } from './prize.service';
  import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
  import { Request } from 'express';
  import { Roles } from 'src/auth/roles/roles.decorator';
  import { RoleGuard } from 'src/auth/roles.guard';
  import { UpdatePrizeDto } from './dto/update-prize.dto';

  
  @Controller('prize')
  @ApiTags('prize')
  export class PrizeController {
    constructor(private prizeService: PrizeService) {}
    
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getPrizeByUser(@Req() req: Request) {
    console.log(req.user);
    let userId = req.user["id"];
    return await this.prizeService.getPriseByUser(userId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RoleGuard) 
  @Roles('ADMIN')
  @ApiBearerAuth()
  async updatePrize(@Param('id') id: string, @Body() updatePrizeDto: UpdatePrizeDto,) {
    return await this.prizeService.UpdatePrize(+id, updatePrizeDto);
  }

  @Delete(':id') 
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  async deletePrize(@Param('id') id: string) {
    return await this.prizeService.deletePrize(+id);
  }

}