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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CreateModelDto } from './dto/create-model.dto';
import { ModelService } from './model.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { RoleGuard } from 'src/auth/roles.guard';
import { UpdateModelDto } from './dto/update-model.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MinioService } from 'src/minio/minio.service';

@Controller('model')
@ApiTags('model')
export class ModelController {
  constructor(
    private modelService: ModelService,
    private readonly minioService: MinioService,
  ) {}

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
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'deal', enum: ['0', '1'] })
  @ApiQuery({ name: 'all', enum: ['0', '1'] })
  @ApiQuery({ name: 'productId', required: false })
  @ApiQuery({ name: 'categoryId', required: false })
  async getAllModels(
    @Query('search') search: string,
    @Query('deal') deal = '0',
    @Query('all') all = '1',
    @Query('productId') productId: string,
    @Query('categoryId') categoryId: string,
    @Query() { limit = 10, skip = 0 },
  ) {
    const dealBool = deal === '1';
    const allBool = all === '1';
    return await this.modelService.getModels(
      dealBool,
      allBool,
      categoryId,
      productId,
      search,
      limit,
      skip,
    );
  }

  @Get('admin/all')
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'deal', enum: ['0', '1'] })
  @ApiQuery({ name: 'all', enum: ['0', '1'] })
  @ApiQuery({ name: 'productId', required: false })
  @ApiQuery({ name: 'categoryId', required: false })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  async getAllModelsForAdmin(
    @Query('search') search: string,
    @Query('deal') deal = '0',
    @Query('all') all = '1',
    @Query('productId') productId: string,
    @Query('categoryId') categoryId: string,
    @Query() { limit = 10, skip = 0 },
  ) {
    const dealBool = deal === '1';
    const allBool = all === '1';
    return await this.modelService.getModelsForAdmin(
      dealBool,
      allBool,
      categoryId,
      productId,
      search,
      limit,
      skip,
    );
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

  @Patch(':id/incrementStock')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @Roles('ADMIN')
  async incrementStock(@Param('id') id: string, @Body('stock') stock: number) {
    return await this.modelService.incrementStockCount(+id, stock);
  }

  @Patch(':id/decrementStock')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @Roles('ADMIN')
  async decrementStock(@Param('id') id: string, @Body('stock') stock: number) {
    return await this.modelService.decrementStockCount(+id, stock);
  }

  @Post(':id/addPhoto')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
  ) {
    await this.minioService.createBucketIfNotExists();
    const modelId = +id;
    const fileName = await this.minioService.uploadFile(file);
    const photoAddedModel = await this.modelService.addPhotoUrl(
      modelId,
      fileName,
    );
    return photoAddedModel;
  }

  @Post(':id/removePhoto/:photoUrl')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  async removeFile(
    @Param('id') id: string,
    @Param('photoUrl') photoUrl: string,
  ) {
    const modelId = +id;
    await this.minioService.deleteFile(photoUrl);
    const removedPhotoModel = await this.modelService.deletePhotoUrl(
      modelId,
      photoUrl,
    );

    return removedPhotoModel;
  }

  @Get('modelPhoto/:fileName')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getFileUrl(@Param('fileName') fileName: string) {
    return await this.minioService.getFileUrl(fileName);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @Roles('ADMIN')
  async deleteModel(@Param('id') id: string) {
    return await this.modelService.remove(+id);
  }
}
