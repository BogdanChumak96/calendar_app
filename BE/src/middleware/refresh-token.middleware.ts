import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from 'src/auth/auth.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class RefreshTokenMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.cookies['accessToken'];
    const refreshToken = req.cookies['refreshToken'];

    try {
      if (accessToken) {
        const decoded = jwt.decode(accessToken) as { exp: number };
        const currentTime = Math.floor(Date.now() / 1000);

        if (decoded && decoded.exp < currentTime) {
          const email =
            await this.authService.validateRefreshToken(refreshToken);
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            await this.authService.generateTokens({ email });

          res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
          });
          res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
          });

          return res.redirect(req.originalUrl);
        }
      }

      if (refreshToken) {
        const email = await this.authService.validateRefreshToken(refreshToken);
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          await this.authService.generateTokens({ email });

        res.cookie('accessToken', newAccessToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
        });
        res.cookie('refreshToken', newRefreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
        });

        return next();
      }

      throw new UnauthorizedException('Authentication failed');
    } catch (error) {
      console.error('Error in token verification:', error);
      throw new UnauthorizedException('Invalid or expired tokens');
    }
  }
}
