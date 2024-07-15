//src/auth/auth.controller.ts

import { Body, Controller, Ip, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthEntity } from './entity/auth.entity';
import { LoginDto } from './dto/login.dto';
import { Request } from 'express';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({ type: AuthEntity })
  login(
    @Body() { phoneNumber, password }: LoginDto,
    @Req() req: Request,
  ): Promise<AuthEntity> {
    const ips = req.headers['x-forwarded-for'] as string;
    const ip = ips.split(',')[0];
    return this.authService.login(phoneNumber, password, ip);
  }
}
