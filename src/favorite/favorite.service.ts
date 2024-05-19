import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';

@Injectable()
export class FavoriteService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateFavoriteDto) {
    try {
      const { userId, modelId } = data;
      return await this.prisma.favorite.create({
        data: {
          userId,
          modelId,
        },
      });
    } catch (error) {
      console.error('Error creating favorite:', error);
      throw new InternalServerErrorException('Failed to create favorite');
    }
  }

  async findAll() {
    try {
      return await this.prisma.favorite.findMany();
    } catch (error) {
      console.error('Error finding all favorites:', error);
      throw new InternalServerErrorException('Failed to find all favorites');
    }
  }

  async findOne(id: number) {
    try {
      const favorite = await this.prisma.favorite.findUnique({ where: { id } });
      if (!favorite) {
        throw new NotFoundException('Favorite not found');
      }
      return favorite;
    } catch (error) {
      console.error('Error finding favorite:', error);
      throw new InternalServerErrorException('Failed to find favorite');
    }
  }

  async update(id: number, data: UpdateFavoriteDto) {
    try {
      return await this.prisma.favorite.update({
        where: { id },
        data: {
          ...data,
        },
      });
    } catch (error) {
      console.error('Error updating favorite:', error);
      throw new NotFoundException('Favorite not found');
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
