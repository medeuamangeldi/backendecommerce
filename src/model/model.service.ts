import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateModelDto } from './dto/create-model.dto';
import { UpdateModelDto } from './dto/update-model.dto';

@Injectable()
export class ModelService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateModelDto) {
    try {
      return await this.prisma.model.create({ data });
    } catch (error) {
      throw new HttpException('error', 404, { cause: new Error('Error') });
    }
  }
  async update(id: number, data: UpdateModelDto) {
    try {
      return await this.prisma.model.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new HttpException('error', 404, { cause: new Error('Error') });
    }
  }

  async getModelById(id: number) {
    const model = await this.prisma.model.findUnique({
      where: { id },
    });

    if (!model) {
      throw new NotFoundException('Model not found');
    }
    return model;
  }

  async getModels(deal: boolean) {
    const models = await this.prisma.model.findMany({
      where: {
        deal,
      },
    });
    return models;
  }

  async remove(id: number) {
    try {
      return await this.prisma.model.delete({
        where: { id },
      });
    } catch (error) {
      throw new HttpException('error', 404, { cause: new Error('Error') });
    }
  }
}
