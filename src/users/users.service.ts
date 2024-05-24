import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { ProfileService } from 'src/profile/profile.service';
import { CreateProfileDto } from 'src/profile/dto/create-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private readonly profileService: ProfileService,
  ) {}

  async create(data: CreateUserDto) {
    try {
      let user = await this.prisma.user.findUnique({
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
      user = await this.prisma.user.create({ data });
      if (user?.id) {
        await this.profileService.create({
          userId: user.id,
          firstName: '',
          lastName: '',
          avatarUrl: '',
        });
      }
      return user;
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
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
  async getUserPrizes(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        phoneNumber: true,
        secretCode: false,
        password: false,
        profile: false,
        prizes: {
          select: {
            id: true,
            prizeName: true,
            userId: true,
            lotoDay: { select: { lotoDate: true } },
          },
        },
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
