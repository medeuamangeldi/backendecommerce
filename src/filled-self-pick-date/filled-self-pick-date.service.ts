import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFilledSelfPickDateDto } from './dto/create-filledSelfPickDate.dto';
import { UpdateFilledSelfPickDateDto } from './dto/update-filledSelfPickDate.dto';

@Injectable()
export class FilledSelfPickDateService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateFilledSelfPickDateDto) {
    return await this.prisma.filledSelfPickDate.create({
      data,
    });
  }

  async findAll() {
    return await this.prisma.filledSelfPickDate.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.filledSelfPickDate.findUnique({
      where: { id },
    });
  }

  async findOneByDate(date: string) {
    return await this.prisma.filledSelfPickDate.findFirst({
      where: { date },
    });
  }

  async update(
    id: number,
    updateFilledSelfPickDateDto: UpdateFilledSelfPickDateDto,
  ) {
    return await this.prisma.filledSelfPickDate.update({
      where: { id },
      data: updateFilledSelfPickDateDto,
    });
  }

  async increment(id: number, by: number) {
    return await this.prisma.filledSelfPickDate.update({
      where: { id },
      data: {
        count: {
          increment: by,
        },
      },
    });
  }

  async remove(id: number) {
    return await this.prisma.filledSelfPickDate.delete({
      where: { id },
    });
  }
}
