import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {

    constructor(private prisma: PrismaService) {}
    async create(data: CreateProductDto) {
        try{
            return await this.prisma.product.create({ data });
        } catch(error) {
            throw new HttpException("error", 404, { cause: new Error("Error")});
        }
    }
    async findAll() {
        try {
            return await this.prisma.product.findMany();
        } catch (error) {
            throw new HttpException("error", 404, { cause: new Error("Error")});
        }
    }
    async update(id: number, data: UpdateProductDto) {
        try {
          return await this.prisma.product.update({
            where: { id },
            data,
          });
        } catch (error) {
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