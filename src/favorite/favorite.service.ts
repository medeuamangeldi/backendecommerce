import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

@Injectable()
export class FavoriteService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateFavoriteDto) {
    try {
      return await this.prisma.favorite.create({
        data,
      });
    } catch (error) {
      console.error('Error creating favorite:', error);
      throw new InternalServerErrorException('Failed to create favorite');
    }
  }

  async findAll() {
    try {
      return await this.prisma.favorite.findMany({
        include: {
          model: true,
        },
      });
    } catch (error) {
      console.error('Error finding all favorites:', error);
      throw new InternalServerErrorException('Failed to find all favorites');
    }
  }

  async findAllByUserId(userId: number) {
    try {
      return await this.prisma.favorite.findMany({
        where: { userId },
        include: {
          model: true,
        },
      });
    } catch (error) {
      console.error('Error finding favorites for user:', error);
      throw new InternalServerErrorException(
        'Failed to find favorites for user',
      );
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.favorite.delete({
        where: { id },
      });
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw new NotFoundException('Favorite not found');
    }
  }
}
