import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('Authorization token not found');
    }

    try {
      const payload = this.jwtService.verify(token);
      request.user = payload;
    } catch (err) {
      console.error('Error in token verification:', err);
      throw new UnauthorizedException('Invalid or expired token');
    }

    return true;
  }

  private extractToken(request: Request): string | null {
    const authorizationHeader = request.headers['authorization'];
    const accessToken = request.cookies['accessToken'];

    if (authorizationHeader?.startsWith('Bearer ')) {
      return authorizationHeader.split(' ')[1];
    } else if (accessToken) {
      return accessToken;
    }

    return null;
  }
}
