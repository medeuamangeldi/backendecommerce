import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
  } from '@nestjs/common';
  import { FavoriteService } from './favorite.service';
  import { CreateFavoriteDto } from './dto/create-favorite.dto';
  import { UpdateFavoriteDto } from './dto/update-favorite.dto';
  import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
  import { Roles } from 'src/auth/roles/roles.decorator';
  import { RoleGuard } from 'src/auth/roles.guard';
  import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
  
  @Controller('favorite')
  @ApiTags('favorite')
  export class FavoriteController {
    constructor(private readonly favoriteService: FavoriteService) {}
  
    @Post()
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles('USER', 'ADMIN')
    @ApiBearerAuth()
    async create(@Body() createFavoriteDto: CreateFavoriteDto) {
      return await this.favoriteService.create(createFavoriteDto);
    }
  
    @Get()
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles('ADMIN')
    @ApiBearerAuth()
    async findAll() {
      return await this.favoriteService.findAll();
    }
  
    @Get(':id')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles('USER', 'ADMIN')
    @ApiBearerAuth()
    async findOne(@Param('id') id: string) {
      return await this.favoriteService.findOne(+id);
    }
  
    @Patch(':id')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles('USER', 'ADMIN')
    @ApiBearerAuth()
    async update(
      @Param('id') id: string,
      @Body() updateFavoriteDto: UpdateFavoriteDto,
    ) {
      return await this.favoriteService.update(+id, updateFavoriteDto);
    }
  
    @Delete(':id')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles('USER', 'ADMIN')
    @ApiBearerAuth()
    async remove(@Param('id') id: string) {
      return await this.favoriteService.remove(+id);
    }
  }
  