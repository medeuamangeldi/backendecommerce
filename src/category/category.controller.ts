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
  import { CreateCategoryDto } from './dto/create-category.dto';
  import { CategoryService } from './category.service';
  import { UpdateCategoryDto } from './dto/update-category.dto';
  import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
  import { Roles } from 'src/auth/roles/roles.decorator';
  import { RoleGuard } from 'src/auth/roles.guard';


@Controller('category')
@ApiTags('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoryService.create(createCategoryDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @Roles('ADMIN')
  async getAllCategories() {
    return await this.categoryService.findAll();
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @Roles('ADMIN')
  async update(
    @Param('id') id: string,
    @Body() UpdateCategoryDto: UpdateCategoryDto,
  ) {
    return await this.categoryService.update(+id, UpdateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @Roles('ADMIN')
  async deleteCategory(@Param('id') id: string) {
    return await this.categoryService.remove(+id);
  }
}