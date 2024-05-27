import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateModelDto } from './dto/create-model.dto';
import { ModelService } from './model.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { RoleGuard } from 'src/auth/roles.guard';
import { UpdateModelDto } from './dto/update-model.dto';

@Controller('model')
@ApiTags('model')
export class ModelController {
  constructor(private modelService: ModelService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  async create(@Body() createModelDto: CreateModelDto) {
    return await this.modelService.create(createModelDto);
  }

  @Get(':id')
  async getModelById(@Param('id') id: string) {
    return await this.modelService.getModelById(+id);
  }

  @Get()
  @ApiQuery({ name: 'deal' })
  async getAllModels(@Query('deal') deal = '0') {
    const dealBool = deal === '1';
    return await this.modelService.getModels(dealBool);
  }

  @Get()
  @ApiQuery({ name: 'productId' })
  async getModelsByProductId(@Query('productId') productId = '1') {
    return await this.modelService.getModelsByProductId(+productId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @Roles('ADMIN')
  async update(
    @Param('id') id: string,
    @Body() updateModelDto: UpdateModelDto,
  ) {
    return await this.modelService.update(+id, updateModelDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @Roles('ADMIN')
  async deleteModel(@Param('id') id: string) {
    return await this.modelService.remove(+id);
  }
}
