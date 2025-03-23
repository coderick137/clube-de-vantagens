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
    this.logger.log(
      `Iniciando criação de cliente: ${JSON.stringify(createClienteDto)}`,
    );
    this.logger.log(`Criando cliente: ${createClienteDto.nome}`);

    try {
      const { nome, email, senha } = createClienteDto;

      this.validarTipoCliente(tipoCliente);

      const clienteExistente = await this.clienteRepository.findByEmail(email);

      if (clienteExistente) {
        this.logger.warn(`Cliente com email ${email} já existe`);
        throw new ConflictException(`Cliente com email ${email} já existe`);
      }

      const senhaHash = await this.hashSenha(senha);

      const novoCliente = await this.clienteRepository.createClient(
        {
          nome,
          email,
          senha: senhaHash,
        },
        tipoCliente,
      );

      return await this.clienteRepository.createClient(
        novoCliente,
        tipoCliente,
      );
    } catch (error) {
      this.logger.error(`Erro ao criar cliente: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<Cliente | undefined> {
    this.logger.log(`Iniciando busca de cliente pelo email: ${email}`);
    this.logger.log(`Buscando cliente com email ${email}`);
    try {
      const cliente = await this.clienteRepository.findByEmail(email);
      if (!cliente) {
        this.logger.warn(`Cliente não encontrado com o email: ${email}`);
      }
      return cliente;
    } catch (error) {
      this.logger.error(
        `Erro ao buscar cliente: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findAll(): Promise<Cliente[]> {
    this.logger.log('Iniciando busca de todos os clientes');
    this.logger.log('Buscando todos os clientes');
    try {
      const clientes = await this.clienteRepository.findAllClients();
      if (clientes.length === 0) {
        this.logger.warn('Nenhum cliente encontrado na base de dados');
        throw new NotFoundException('Nenhum cliente encontrado.');
      }
      this.logger.log(`Total de clientes encontrados: ${clientes.length}`);
      return clientes;
    } catch (error) {
      this.logger.error(
        `Erro ao buscar todos os clientes: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async validarTipoCliente(tipo: string): Promise<void> {
    this.logger.log(`Validando tipo de cliente: ${tipo}`);
    if (!this.tipos.includes(tipo)) {
      this.logger.warn(`Tipo de cliente inválido: ${tipo}`);
      throw new ConflictException(
        `Tipo de cliente inválido. Permitidos: ${this.tipos.join(', ')}`,
      );
    }
  }

  private async hashSenha(senha: string): Promise<string> {
    this.logger.log('Iniciando hash da senha');
    try {
      const salt = await bcrypt.genSalt(10);
      return bcrypt.hash(senha, salt);
    } catch (error) {
      this.logger.error(
        `Erro ao gerar hash da senha: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
