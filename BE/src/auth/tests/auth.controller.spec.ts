import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { LoginDto } from '../dto/login-user.dto';
import { RegisterDto } from '../dto/register-user.dto';
import { Response } from 'express';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
    generateTokens: jest.fn(),
    verifyAccessToken: jest.fn(),
  };

  const mockResponse = {
    cookie: jest.fn(),
    clearCookie: jest.fn(),
    send: jest.fn(),
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should login and set cookies', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const tokens = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };

      mockAuthService.login.mockResolvedValue(tokens);

      await authController.login(loginDto, mockResponse);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'accessToken',
        tokens.accessToken,
        {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
        },
      );
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'refreshToken',
        tokens.refreshToken,
        {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
        },
      );
      expect(mockResponse.send).toHaveBeenCalledWith({
        message: 'Login successful',
      });
    });

    it('should throw UnauthorizedException if login fails', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      mockAuthService.login.mockRejectedValue(new Error('Invalid credentials'));

      await expect(
        authController.login(loginDto, mockResponse),
      ).rejects.toThrow('Invalid email or password');
    });
  });

  describe('register', () => {
    it('should register a new user and set cookies', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        country: 'Test Country',
      };

      const user = {
        email: registerDto.email,
        country: registerDto.country,
        name: registerDto.name,
      };

      const tokens = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };

      mockAuthService.register.mockResolvedValue(user);
      mockAuthService.generateTokens.mockReturnValue(tokens);

      await authController.register(registerDto, mockResponse);

      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(mockAuthService.generateTokens).toHaveBeenCalledWith({
        email: user.email,
        country: user.country,
      });
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'accessToken',
        tokens.accessToken,
        {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
        },
      );
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'refreshToken',
        tokens.refreshToken,
        {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
        },
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.send).toHaveBeenCalledWith({
        message: 'User registered successfully',
      });
    });

    it('should throw ConflictException if user already exists', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        country: 'Test Country',
      };

      mockAuthService.register.mockRejectedValue(
        new Error('User already exists'),
      );

      await expect(
        authController.register(registerDto, mockResponse),
      ).rejects.toThrow('User with this email already exists');
    });
  });

  describe('logout', () => {
    it('should clear cookies and send response', () => {
      authController.logout(mockResponse);

      expect(mockResponse.clearCookie).toHaveBeenCalledWith('accessToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });
      expect(mockResponse.clearCookie).toHaveBeenCalledWith('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith({
        message: 'Logged out successfully',
      });
    });
  });

  describe('verifyToken', () => {
    it('should verify token and return user details', async () => {
      const req = {
        cookies: {
          accessToken: 'valid-token',
        },
      } as any;

      const user = {
        email: 'test@example.com',
        id: '123',
        country: 'Test Country',
      };

      mockAuthService.verifyAccessToken.mockResolvedValue(user);

      await authController.verifyToken(req, mockResponse);

      expect(authService.verifyAccessToken).toHaveBeenCalledWith('valid-token');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Authorized',
        user,
      });
    });

    it('should return 401 if token is invalid', async () => {
      const req = {
        cookies: {
          accessToken: null,
        },
      } as any;

      await authController.verifyToken(req, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Unauthorized',
      });
    });
  });
});
