import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { ClientesService } from '../clientes/service/clientes.service';

interface UsuarioPayload {
  email: string;
  id: number;
  tipo: string[] | string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly clienteService: ClientesService,
    private readonly jwtService: JwtService,
  ) {}
  async login(email: string, senha: string) {
    const cliente = await this.clienteService.findByEmail(email);
    if (!cliente) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    const senhaDescriptografada = await compare(senha, cliente.senha);
    if (!senhaDescriptografada) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    const payload: UsuarioPayload = {
      email,
      id: cliente.id,
      tipo: cliente.tipo,
    };

    const accessToken = this.jwtService.sign(payload);
    console.log('Access Token:', accessToken); // Apenas para faciltar a visualização do token, não faça isso em produção
    return {
      access_token: accessToken,
    };
  }
}
