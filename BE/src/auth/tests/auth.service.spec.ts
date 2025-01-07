import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/users/model/user.schema';
import { Types } from 'mongoose';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;
  let configService: Partial<ConfigService>;

  const mockUser: Partial<User> = {
    _id: new Types.ObjectId('64d532b3e5f2f8e1aee0c2f3'),
    email: 'test@example.com',
    password: 'hashedPassword',
    name: 'Test User',
    country: 'TestCountry',
  };

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };

    jwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
    };

    configService = {
      get: jest.fn((key: string) => {
        if (key === 'JWT_SECRET') return 'mockSecret';
        if (key === 'JWT_ACCESS_EXPIRES') return '1h';
        if (key === 'JWT_REFRESH_EXPIRES') return '7d';
        return null;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('validateUser', () => {
    it('should validate a user with correct email and password', async () => {
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.validateUser('test@example.com', 'password');

      expect(result).toEqual(mockUser);
      expect(usersService.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'password',
        mockUser.password,
      );
    });

    it('should return null for invalid credentials', async () => {
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
      (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.validateUser(
        'test@example.com',
        'wrongPassword',
      );

      expect(result).toBeNull();
    });

    it('should throw UnauthorizedException for errors', async () => {
      (usersService.findByEmail as jest.Mock).mockRejectedValue(new Error());

      await expect(
        service.validateUser('test@example.com', 'password'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should login a user and return tokens', async () => {
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (jwtService.sign as jest.Mock).mockReturnValue('mockToken');

      const result = await service.login({
        email: 'test@example.com',
        password: 'password',
      });

      expect(result).toEqual({
        accessToken: 'mockToken',
        refreshToken: 'mockToken',
      });
      expect(usersService.findByEmail).toHaveBeenCalledWith('test@example.com');
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
      (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);

      await expect(
        service.login({ email: 'test@example.com', password: 'wrongPassword' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should register a new user', async () => {
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');
      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);
      (usersService.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.register({
        email: 'test@example.com',
        password: 'password',
        name: 'Test User',
        country: 'TestCountry',
      });

      expect(result).toEqual(mockUser);
      expect(usersService.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(usersService.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'Test User',
        country: 'TestCountry',
      });
    });

    it('should throw ConflictException if user already exists', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);

      await expect(
        service.register({
          email: 'test@example.com',
          password: 'password',
          name: 'Test User',
          country: 'TestCountry',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('generateTokens', () => {
    it('should generate access and refresh tokens', () => {
      (jwtService.sign as jest.Mock).mockReturnValue('mockToken');

      const result = service.generateTokens({
        email: 'test@example.com',
        id: 'mockUserId',
      });

      expect(result).toEqual({
        accessToken: 'mockToken',
        refreshToken: 'mockToken',
      });
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify a valid access token', async () => {
      (jwtService.verify as jest.Mock).mockReturnValue({
        email: 'test@example.com',
      });

      const result = await service.verifyAccessToken('mockToken');

      expect(result).toEqual({ email: 'test@example.com' });
      expect(jwtService.verify).toHaveBeenCalledWith('mockToken', {
        secret: 'mockSecret',
      });
    });

    it('should throw UnauthorizedException for invalid token', async () => {
      (jwtService.verify as jest.Mock).mockImplementation(() => {
        throw new Error();
      });

      await expect(service.verifyAccessToken('invalidToken')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('validateRefreshToken', () => {
    it('should validate a valid refresh token', async () => {
      (jwtService.verify as jest.Mock).mockReturnValue({
        email: 'test@example.com',
      });

      const result = await service.validateRefreshToken('mockRefreshToken');

      expect(result).toEqual('test@example.com');
      expect(jwtService.verify).toHaveBeenCalledWith('mockRefreshToken');
    });

    it('should throw UnauthorizedException for invalid refresh token', async () => {
      (jwtService.verify as jest.Mock).mockImplementation(() => {
        throw new Error();
      });

      await expect(
        service.validateRefreshToken('invalidRefreshToken'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
