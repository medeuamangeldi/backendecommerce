import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}
  async create(data: CreateProductDto) {
    try {
      return await this.prisma.product.create({ data });
    } catch (error) {
      throw new HttpException('error', 404, { cause: new Error('Error') });
    }
  }
  async findAll(payload: { search: string; limit: number; skip: number }) {
    const { search, limit, skip } = payload;
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
    try {
      return await this.prisma.product.findMany({
        where: whereClause,
        select: {
          id: true,
          nameKz: true,
          nameEn: true,
          nameRu: true,
          description: true,
          createdAt: true,
          updatedAt: true,
          models: true,
          category: true,
          categoryId: true,
          currency: true,
        },
        take: +limit,
        skip: +skip,
      });
    } catch (error) {
      throw new HttpException('error', 404, { cause: new Error('Error') });
    }
  }

  async getSingleProduct(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        nameKz: true,
        nameEn: true,
        nameRu: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        models: true,
        category: false,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(id: number, data: UpdateProductDto) {
    try {
      return await this.prisma.product.update({
        where: { id },
        data,
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 404);
    }
  }
  async remove(id: number) {
    try {
      return await this.prisma.product.delete({
        where: { id },
        select: { id: true },
      });
    } catch (error) {
      throw new HttpException(error, 404);
    }
  }
}
