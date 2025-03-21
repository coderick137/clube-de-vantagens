import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

declare module 'express' {
  export interface Request {
    user?: JwtPayload;
  }
}
import { JwtPayload } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { IS_PUBLIC_KEY } from '../../shared/decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Token não encontrado no cabeçalho.');
    }
    try {
      if (!this.isValidTokenFormat(token)) {
        throw new UnauthorizedException('Formato de token inválido.');
      }
      const secret = this.configService.get<string>('JWT_SECRET');
      if (!secret) {
        throw new UnauthorizedException('Erro interno de configuração.');
      }
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret,
        algorithms: ['HS256'],
      });
      request.user = payload;
    } catch (error) {
      console.error('Erro ao verificar o token:', error);
      throw new UnauthorizedException('Token inválido ou expirado.');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private isValidTokenFormat(token: string): boolean {
    const parts = token.split('.');
    return parts.length === 3;
  }
}
