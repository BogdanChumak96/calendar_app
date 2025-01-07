import { Test, TestingModule } from '@nestjs/testing';
import { RefreshTokenMiddleware } from './refresh-token.middleware';
import { AuthService } from '../auth/auth.service';
import * as jwt from 'jsonwebtoken';
import { UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

describe('RefreshTokenMiddleware', () => {
  let middleware: RefreshTokenMiddleware;
  let authService: AuthService;
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(async () => {
    const mockAuthService = {
      validateRefreshToken: jest.fn(),
      generateTokens: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokenMiddleware,
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    middleware = module.get<RefreshTokenMiddleware>(RefreshTokenMiddleware);
    authService = module.get<AuthService>(AuthService);

    req = {
      cookies: {
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      },
      originalUrl: '/test-url',
    } as any;

    res = {
      cookie: jest.fn(),
      redirect: jest.fn(),
    } as any;

    next = jest.fn();
  });

  it('should throw UnauthorizedException if no refreshToken is provided', async () => {
    req.cookies.refreshToken = undefined;
    jest
      .spyOn(jwt, 'decode')
      .mockReturnValue({ exp: Math.floor(Date.now() / 1000) - 1 });

    await expect(middleware.use(req, res, next)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if both tokens are invalid', async () => {
    req.cookies.refreshToken = undefined;
    jest
      .spyOn(jwt, 'decode')
      .mockReturnValue({ exp: Math.floor(Date.now() / 1000) - 1 });

    jest
      .spyOn(authService, 'validateRefreshToken')
      .mockRejectedValue(new UnauthorizedException('Invalid refresh token'));

    await expect(middleware.use(req, res, next)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
