import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from 'src/auth/roles.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

@Controller('favorite')
@ApiTags('favorite')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  async create(
    @Body() createFavoriteDto: CreateFavoriteDto,
    @Req() req: Request,
  ) {
    createFavoriteDto.userId = req.user['id'];
    return await this.favoriteService.create(createFavoriteDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  async findAll() {
    return await this.favoriteService.findAll();
  }

  @Get()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  async findAllByUserId(@Req() req: Request) {
    const userId = req.user['id'];
    return await this.favoriteService.findAllByUserId(+userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  async remove(@Param('id') id: string) {
    return await this.favoriteService.remove(+id);
  }
}
