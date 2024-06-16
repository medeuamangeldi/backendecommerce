import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCategoryDto) {
    try {
      return await this.prisma.category.create({ data });
    } catch (error) {
      console.log(error);
      throw new HttpException('error', 404, { cause: new Error('Error') });
    }
  }

  async update(id: number, data: UpdateCategoryDto) {
    try {
      return await this.prisma.category.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new HttpException('error', 404, { cause: new Error('Error') });
    }
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      select: {
        id: true,
        nameKz: true,
        nameEn: true,
        nameRu: true,
        description: true,
        photoUrl: true,
        iconUrl: true,
        createdAt: true,
        updatedAt: true,
        products: {
          select: {
            id: true,
            nameKz: true,
            nameEn: true,
            nameRu: true,
            description: true,
            createdAt: true,
            updatedAt: true,
            models: {
              select: {
                id: true,
                name: true,
                price: true,
                deal: true,
                photoUrls: true,
              },
            },
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async findAll(search: string, limit: number, skip: number) {
    let whereClause = {};
    if (search) {
      whereClause = {
        OR: [
          { nameKz: { contains: search } },
          { nameEn: { contains: search } },
          { nameRu: { contains: search } },
        ],
      };
    }
    return await this.prisma.category.findMany({
      where: whereClause,
      skip: +skip,
      take: +limit,
    });
  }

  async remove(id: number) {
    try {
      return await this.prisma.category.delete({
        where: { id },
      });
    } catch (error) {
      throw new HttpException('error', 404, { cause: new Error('Error') });
    }
  }
}
