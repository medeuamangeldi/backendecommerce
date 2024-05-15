import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { phoneNumber: data.phoneNumber },
      });
      if (user) {
        throw new HttpException(
          `User with phone number ${data.phoneNumber} already exists`,
          409,
        );
      }

      const hashedPassword = await bcrypt.hash(
        data.password,
        parseInt(process.env.SALT_ROUNDS),
      );

      data.password = hashedPassword;
      return await this.prisma.user.create({ data });
    } catch (error) {
      throw new HttpException(error, 422);
    }
  }

  async findAll() {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        phoneNumber: true,
        secretCode: false,
        password: false,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        phoneNumber: true,
        secretCode: false,
        password: false,
        createdAt: true,
        updatedAt: true,
        profile: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: number, data: UpdateUserDto) {
    try {
      if (data.password) {
        data.password = await bcrypt.hash(
          data.password,
          parseInt(process.env.SALT_ROUNDS),
        );
      }
      return await this.prisma.user.update({
        where: { id },
        data,
        select: {
          id: true,
          phoneNumber: true,
          secretCode: false,
          password: false,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      throw new HttpException(error, 404);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.user.delete({
        where: { id },
        select: { id: true },
      });
    } catch (error) {
      throw new HttpException(error, 404);
    }
  }
}
