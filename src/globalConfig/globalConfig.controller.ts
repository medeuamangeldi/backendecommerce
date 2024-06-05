import {
  Body,
  Controller,
  Post,
  UseGuards,
  Param,
  Patch,
  Delete,
  Get,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CreateGlobalConfigDto } from './dto/create-globalConfig.dto';
import { UpdateGlobalConfigDto } from './dto/update-globalConfig.dto';
import { GlobalConfigService } from './globalConfig.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { RoleGuard } from 'src/auth/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { MinioService } from 'src/minio/minio.service';

@Controller('globalConfig')
@ApiTags('globalConfig')
export class GlobalConfigController {
  constructor(
    private globalConfigService: GlobalConfigService,
    private readonly minioService: MinioService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  async createGlobalConfig(
    @Body() createGlobalConfigDto: CreateGlobalConfigDto,
  ) {
    return await this.globalConfigService.createGC(createGlobalConfigDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  async updateGlobalConfig(
    @Param('id') id: string,
    @Body() updateGlobalConfigDto: UpdateGlobalConfigDto,
  ) {
    return await this.globalConfigService.updateGC(+id, updateGlobalConfigDto);
  }

  @Post(':id/oferta')
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
  async uploadFileOferta(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    await this.minioService.createBucketIfNotExists();
    const idGC = +id;
    const fileName = await this.minioService.uploadFile(file);
    const ofertaUpdated = await this.globalConfigService.updateGC(idGC, {
      ofertaUrl: fileName,
    });

    return ofertaUpdated;
  }

  @Get('oferta/:fileName')
  async getFileUrl(@Param('fileName') fileName: string) {
    return await this.minioService.getFileUrl(fileName);
  }

  @Get()
  async getGlobalConfig() {
    return await this.globalConfigService.getGC();
  }
}
