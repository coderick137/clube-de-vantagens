import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    try {
      // Obtém as roles permitidas para a rota
      const allowedRoles = this.reflector.get<string[]>(
        ROLES_KEY,
        context.getHandler(),
      );

      // Se não houver roles definidas, permite o acesso
      if (!allowedRoles || allowedRoles.length === 0) {
        return true;
      }

      // Obtém o usuário da requisição
      const request = context
        .switchToHttp()
        .getRequest<{ user: { tipo: string | string[] } }>();
      const user = request.user;

      // Verifica se o usuário está autenticado e tem roles definidas
      if (!user || !user.tipo) {
        throw new UnauthorizedException(
          'Usuário não autenticado ou token inválido.',
        );
      }

      // Verifica se o usuário tem uma das roles permitidas
      const hasPermission = this.matchRoles(allowedRoles, user.tipo);

      if (!hasPermission) {
        throw new ForbiddenException(
          'Acesso negado. Permissões insuficientes.',
        );
      }

      return true;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido';
      throw new UnauthorizedException(
        'Erro ao verificar as permissões: ' + errorMessage,
      );
    }
  }

  private matchRoles(
    allowedRoles: string[],
    userRoles: string | string[],
  ): boolean {
    // Converte userRoles para um array, caso seja uma string
    const userRolesArray = Array.isArray(userRoles) ? userRoles : [userRoles];

    // Verifica se pelo menos uma role do usuário está nas roles permitidas
    return userRolesArray.some((role) => allowedRoles.includes(role));
  }
}
