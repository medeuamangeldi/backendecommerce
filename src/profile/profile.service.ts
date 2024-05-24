import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangeLanguageDto } from './dto/change-language.dto'; // Import the new DTO

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateProfileDto) {
    try {
      return await this.prisma.profile.create({ data });
    } catch (error) {
      throw new HttpException(error, 404);
    }
  }

  async findOneByUserId(userId: number) {
    try {
      return await this.prisma.profile.findUnique({
        where: { userId },
      });
    } catch (error) {
      throw new HttpException(error, 404);
    }
  }

  async update(data: UpdateProfileDto) {
    try {
      return await this.prisma.profile.update({
        where: { userId: data?.userId },
        data,
      });
    } catch (error) {
      throw new HttpException(error, 404);
    }
  }

  async changeLanguage(userId: number, language: ChangeLanguageDto) {
    try {
      return await this.prisma.user.update({
        where: { id: userId },
        data: { lang: language.language },
      });
    } catch (error) {
      throw new HttpException(error, 404);
    }
  }
}
