import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangeLanguageDto } from './dto/change-language.dto'; // Import the new DTO
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { MinioService } from 'src/minio/minio.service';
import { Request } from 'express';

@Controller('profile')
@ApiTags('profile')
export class ProfileController {
  constructor(
    private profileService: ProfileService,
    private readonly minioService: MinioService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async create(@Body() createProfileDto: CreateProfileDto) {
    return await this.profileService.create(createProfileDto);
  }

  @Get(':userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findOneByUserId(@Param('userId') userId: string) {
    return await this.profileService.findOneByUserId(+userId);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async update(@Body() updateProfileDto: UpdateProfileDto) {
    return await this.profileService.update(updateProfileDto);
  }

  @Patch(':id/change-language')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async changeLanguage(
    @Param('id') id: string,
    @Body() changeLanguageDto: ChangeLanguageDto,
  ) {
    return await this.profileService.changeLanguage(+id, changeLanguageDto);
  }

  @Post('avatar')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        comment: { type: 'string' },
        outletId: { type: 'integer' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    const userId = req.user['id'];
    await this.minioService.createBucketIfNotExists();
    const fileName = await this.minioService.uploadFile(file);
    const userAvatarUpdated = await this.profileService.update({
      avatarUrl: fileName,
      userId,
    });
    return userAvatarUpdated;
  }

  @Get('avatar/:fileName')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getFileUrl(@Param('fileName') fileName: string) {
    return await this.minioService.getFileUrl(fileName);
  }
}
