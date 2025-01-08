import {
  Body,
  ConflictException,
  Controller,
  Get,
  Logger,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-user.dto';
import { RegisterDto } from './dto/register-user.dto';
import { Request, Response } from 'express';
const logger = new Logger('AuthController');

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    try {
      logger.log('Received login request');
      logger.debug(`Login data: ${JSON.stringify(loginDto)}`);

      const { accessToken, refreshToken } =
        await this.authService.login(loginDto);

      logger.log('Tokens generated successfully');
      logger.debug(`Access token: ${accessToken}`);
      logger.debug(`Refresh token: ${refreshToken}`);

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

      logger.log('Cookies set successfully');

      return res.send({ message: 'Login successful' });
    } catch (error) {
      logger.error('Login failed');
      logger.error(error.message);
      throw new UnauthorizedException('Invalid email or password');
    }
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Res() res: Response) {
    try {
      const user = await this.authService.register(registerDto);
      const { accessToken, refreshToken } =
        await this.authService.generateTokens({
          email: user.email,
          country: user.country,
        });

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

  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    return res.status(200).send({ message: 'Logged out successfully' });
  }

  @Get('verify-token')
  async verifyToken(@Req() req: Request, @Res() res: Response) {
    const accessToken = req.cookies['accessToken'];

    if (!accessToken) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const user = await this.authService.verifyAccessToken(accessToken);
      return res.status(200).json({ message: 'Authorized', user });
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  }
}
