import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Delete,
    Post,
    UseGuards,
  } from '@nestjs/common';
  import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
  import { CreateProductDto } from './dto/create-product.dto';
  import { ProductService } from './product.service';
  import { UpdateProductDto } from './dto/update-product.dto';
  import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
  import { RoleGuard } from 'src/auth/roles.guard';
  import { Roles } from 'src/auth/roles/roles.decorator'; 
  
  @Controller('product')
  @ApiTags('product')
  export class ProductController {
    constructor(private productService: ProductService) {}
  
    @Post()
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles('ADMIN')
    @ApiBearerAuth()
    async create(@Body() createProductDto: CreateProductDto) {
      return await this.productService.create(createProductDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async getAllProducts() {
    return await this.productService.findAll();
  }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async getProductById(@Param('id') id: string) {
      return await this.productService.getSingleProduct(+id);
  }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles('ADMIN')
    @ApiBearerAuth()
    async update(
      @Param('id') id: string,
      @Body() updateProductDto: UpdateProductDto,
    ) {
      return await this.productService.update(+id, updateProductDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles('ADMIN')
    @ApiBearerAuth()
    async deleteProduct(@Param('id') id: string) {
    return await this.productService.remove(+id);
  }
}