import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

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

  async update(id: number, data: UpdateProfileDto) {
    try {
      return await this.prisma.profile.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new HttpException(error, 404);
    }
  }
}
