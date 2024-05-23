import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangeLanguageDto } from './dto/change-language.dto'; // Import the new DTO
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('profile')
@ApiTags('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

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

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async update(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return await this.profileService.update(+id, updateProfileDto);
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
}
