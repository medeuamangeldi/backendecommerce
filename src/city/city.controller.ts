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
  import { CityService } from './city.service';
  import { CreateCityDto } from './dto/create-city.dto';
  import { UpdateCityDto } from './dto/update-city.dto';
  import { UpdatePickupUrlsDto } from './dto/update-pickup-urls.dto';
  import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
  import { Roles } from 'src/auth/roles/roles.decorator';
  import { RoleGuard } from 'src/auth/roles.guard';
  import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
  
  @Controller('city')
  @ApiTags('city')
  export class CityController {
    constructor(private readonly cityService: CityService) {}
  
    @Post()
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles('ADMIN')
    @ApiBearerAuth()
    async create(@Body() createCityDto: CreateCityDto) {
      return await this.cityService.create(createCityDto);
    }
  
    @Get()
    async findAll() {
      return await this.cityService.findAll();
    }
  
    @Get(':id')
    async findOne(@Param('id') id: string) {
      return await this.cityService.findOne(+id);
    }
  
    // @Patch(':id')
    // @UseGuards(JwtAuthGuard, RoleGuard)
    // @Roles('ADMIN')
    // @ApiBearerAuth()
    // async update(@Param('id') id: string, @Body() updateCityDto: UpdateCityDto) {
    //   return await this.cityService.update(+id, updateCityDto);
    // }
  
    @Patch(':id/add-pickup-urls')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles('ADMIN')
    @ApiBearerAuth()
    async addPickupUrls(@Param('id') id: string, @Body() body: UpdatePickupUrlsDto) {
      return await this.cityService.addPickupUrls(+id, body.pickupUrls);
    }
  
    @Patch(':id/remove-pickup-urls')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles('ADMIN')
    @ApiBearerAuth()
    async removePickupUrls(@Param('id') id: string, @Body() body: UpdatePickupUrlsDto) {
      return await this.cityService.removePickupUrls(+id, body.pickupUrls);
    }
  
    @Delete(':id')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles('ADMIN')
    @ApiBearerAuth()
    async remove(@Param('id') id: string) {
      return await this.cityService.remove(+id);
    }
  }
  