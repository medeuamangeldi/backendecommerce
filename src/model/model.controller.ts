import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Delete,
    UseGuards,
  } from '@nestjs/common';
  import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
  import { CreateModelDto } from './dto/create-model.dto';
  import { ModelService } from './model.service';
  import { UpdateModelDto } from './dto/update-model.dto';
  import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
  import { Roles } from 'src/auth/roles/roles.decorator';
  import { RoleGuard } from 'src/auth/roles.guard';


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

  @Get(':productId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getModelsByProduct(@Param('productId') productId: string) {
    return await this.modelService.findByProductId(+productId)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @Roles('ADMIN')
  async update(
    @Param('id') id: string,
    @Body() UpdateModelDto: UpdateModelDto,
  ) {
    return await this.modelService.update(+id, UpdateModelDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @Roles('ADMIN')
  async deleteModel(@Param('id') id: string) {
    return await this.modelService.remove(+id);
  }
}