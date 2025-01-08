import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login-user.dto';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register-user.dto';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/model/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.findByEmail(email);
      if (user && (await bcrypt.compare(password, user.password))) {
        const { ...result } = user;
        return result;
      }
      return null;
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const user = await this.usersService.findByEmail(loginDto.email);

      if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const payload = {
        email: user.email,
        id: user._id.toString(),
        country: user.country,
      };
      const { accessToken, refreshToken } = this.generateTokens(payload);

      return { accessToken, refreshToken };
    } catch (error) {
      throw new UnauthorizedException('Login failed');
    }
  }

  async register(createUserDto: RegisterDto): Promise<User> {
    const { email, password, country, name } = createUserDto;
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.usersService.create({
      email,
      country,
      name,
      password: hashedPassword,
    });

    return newUser;
  }

  generateTokens(payload: Record<string, any>) {
    const accessTokenExpires =
      this.configService.get<string>('JWT_ACCESS_EXPIRES') || '1m';
    const refreshTokenExpires =
      this.configService.get<string>('JWT_REFRESH_EXPIRES') || '7d';

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: accessTokenExpires,
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: refreshTokenExpires,
    });

    return { accessToken, refreshToken };
  }

  async verifyAccessToken(token: string): Promise<any> {
    const secret = this.configService.get<string>('JWT_SECRET');
    try {
      return this.jwtService.verify(token, { secret });
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async validateRefreshToken(token: string): Promise<string> {
    try {
      const payload = this.jwtService.verify(token);

      return payload.email;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
