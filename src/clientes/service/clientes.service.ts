import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateClienteDto } from '../dto/create-cliente.dto';
import { ClienteRepository } from '../repository/cliente.repository';
import { Cliente, TipoCliente } from '../entities/cliente.entity';

@Injectable()
export class ClientesService {
  private readonly logger = new Logger(ClientesService.name);
  private readonly tipos = ['admin', 'cliente'];

  constructor(private readonly clienteRepository: ClienteRepository) {}

  async createClient(
    createClienteDto: CreateClienteDto,
    tipoCliente: TipoCliente,
  ): Promise<Cliente> {
    const timestamp = new Date().toISOString();
    this.logger.log(
      `[${timestamp}] Iniciando criação de cliente: ${JSON.stringify(createClienteDto)}`,
    );

    this.validarTipoCliente(tipoCliente);

    const clienteExistente = await this.clienteRepository.findByEmail(
      createClienteDto.email,
    );

    if (clienteExistente) {
      this.logger.warn(
        `[${timestamp}] Cliente com email ${createClienteDto.email} já existe`,
      );
      throw new ConflictException(
        `Cliente com email ${createClienteDto.email} já existe`,
      );
    }

    const senhaHash = await this.hashSenha(createClienteDto.senha);

    this.logger.log(`[${timestamp}] Cliente criado com sucesso`);
    return this.clienteRepository.createClient(
      { ...createClienteDto, senha: senhaHash },
      tipoCliente,
    );
  }

  async findByEmail(email: string): Promise<Cliente | undefined> {
    const timestamp = new Date().toISOString();
    this.logger.log(
      `[${timestamp}] Iniciando busca de cliente pelo email: ${email}`,
    );
    return this.clienteRepository.findByEmail(email);
  }

  async findAll(): Promise<Cliente[]> {
    const timestamp = new Date().toISOString();
    this.logger.log(`[${timestamp}] Iniciando busca de todos os clientes`);
    const clientes = await this.clienteRepository.findAllClients();

    if (clientes.length === 0) {
      this.logger.warn(
        `[${timestamp}] Nenhum cliente encontrado na base de dados`,
      );
      throw new NotFoundException('Nenhum cliente encontrado.');
    }

    this.logger.log(
      `[${timestamp}] ${clientes.length} cliente(s) encontrado(s)`,
    );
    return clientes;
  }

  private validarTipoCliente(tipo: string): void {
    const timestamp = new Date().toISOString();
    this.logger.log(`[${timestamp}] Validando tipo de cliente: ${tipo}`);
    if (!this.tipos.includes(tipo)) {
      this.logger.warn(`[${timestamp}] Tipo de cliente inválido: ${tipo}`);
      throw new ConflictException(
        `Tipo de cliente inválido. Permitidos: ${this.tipos.join(', ')}`,
      );
    }
  }

  private async hashSenha(senha: string): Promise<string> {
    const timestamp = new Date().toISOString();
    this.logger.log(`[${timestamp}] Iniciando hash da senha`);
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(senha, salt);
  }
}
