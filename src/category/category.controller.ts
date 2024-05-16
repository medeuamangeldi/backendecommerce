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


@Controller('category')
@ApiTags('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoryService.create(createCategoryDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getAllUsers() {
    return await this.categoryService.findAll();
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async update(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateCategoryDto,
  ) {
    return await this.categoryService.update(+id, updateProfileDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteUser(@Param('id') id: string) {
    return await this.categoryService.remove(+id);
  }
}