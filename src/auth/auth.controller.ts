//src/auth/auth.controller.ts

import { Body, Controller, Ip, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthEntity } from './entity/auth.entity';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({ type: AuthEntity })
  login(
    @Body() { phoneNumber, password }: LoginDto,
    @Ip() ip: string,
  ): Promise<AuthEntity> {
    return this.authService.login(phoneNumber, password, ip);
  }
}
