import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Delete,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MinioService } from 'src/minio/minio.service';

@Controller('product')
@ApiTags('product')
export class ProductController {
  constructor(
    private productService: ProductService,
    private readonly minioService: MinioService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productService.create(createProductDto);
  }

  @Get()
  async getAllProducts() {
    return await this.productService.findAll();
  }

  @Get(':id')
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

  @Post('photos')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        productId: { type: 'integer' },
        file: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('file'))
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async uploadFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body: { productId: number },
  ) {
    await this.minioService.createBucketIfNotExists();
    const fileNames = await this.minioService.uploadFiles(files);
    const updatedProduct = await this.productService.update(+body.productId, {
      photoUrls: fileNames,
    });
    return updatedProduct;
  }

  @Get('product/:fileName')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getFileUrl(@Param('fileName') fileName: string) {
    return await this.minioService.getFileUrl(fileName);
  }
}
