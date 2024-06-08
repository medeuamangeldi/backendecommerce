import {
  Controller,
  UseGuards,
  Body,
  Post,
  Get,
  Patch,
  Param,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LotoDayService } from './lotoday.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { RoleGuard } from 'src/auth/roles.guard';
import { CreateLotoDayDto } from './dto/create-lotoday.dto';
import { UpdateLotoDayDto } from './dto/update-lotoday.dto';

@Controller('lotoday')
@ApiTags('lotoday')
export class LotoDayController {
  constructor(private lotoDayService: LotoDayService) {}

  @Get()
  async getAllLotoDay() {
    return await this.lotoDayService.getAllLotoDay();
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  async updateLotoDay(
    @Body() updateLotoDayDto: UpdateLotoDayDto,
    @Param('id') id: string,
  ) {
    return await this.lotoDayService.updateLotoDay(+id, updateLotoDayDto);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  async createLotoDay(@Body() createLotoDayDto: CreateLotoDayDto) {
    return await this.lotoDayService.CreateLotoDay(createLotoDayDto);
  }
}
