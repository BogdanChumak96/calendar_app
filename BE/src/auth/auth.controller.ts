import {
  Body,
  ConflictException,
  Controller,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-user.dto';
import { RegisterDto } from './dto/register-user.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    try {
      const { accessToken, refreshToken } =
        await this.authService.login(loginDto);

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });

      return res.send({ message: 'Login successful' });
    } catch (error) {
      throw new UnauthorizedException('Invalid email or password');
    }
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Res() res: Response) {
    try {
      const user = await this.authService.register(registerDto);

      const { accessToken, refreshToken } =
        await this.authService.generateTokens(user.email);

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });

      return res.status(201).send({ message: 'User registered successfully' });
    } catch (error) {
      throw new ConflictException('User with this email already exists');
    }
  }
}
