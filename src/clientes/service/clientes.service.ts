import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import * as bcrypt from 'bcryptjs';
import { CreateClienteDto } from '../dto/create-cliente.dto';
import { ClienteRepository } from '../repository/cliente.repository';
import { Cliente } from '../entities/cliente.entity';

@Injectable()
export class ClientesService {
  private readonly logger = new Logger(ClientesService.name);
  private readonly tipos = ['admin', 'cliente'];

  constructor(private readonly clienteRepository: ClienteRepository) {}

  async createClient(createClienteDto: CreateClienteDto): Promise<Cliente> {
    this.logger.log(`Criando cliente: ${createClienteDto.nome}`);

    try {
      const { nome, email, senha, tipo } = createClienteDto;
      this.validarTipoCliente(tipo);

      const clienteExistente = await this.clienteRepository.findOne({
        where: { email },
      });

      if (clienteExistente) {
        this.logger.warn(`E-mail já cadastrado: ${email}`);
        throw new ConflictException('E-mail já cadastrado');
      }

      const senhaHash = await this.hashSenha(senha);

      const novoCliente = await this.clienteRepository.createClient({
        nome,
        email,
        senha: senhaHash,
        tipo,
      });

      return await this.clienteRepository.save(novoCliente);
    } catch (error) {
      this.logger.error(`Erro ao criar cliente: ${error.message}`);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<Cliente | undefined> {
    this.logger.log(`Buscando cliente com email ${email}`);
    try {
      return await this.clienteRepository.findByEmail(email);
    } catch (error) {
      this.logger.error(`Erro ao buscar cliente: ${error.message}`);
      throw error;
    }
  }

  async findAll(): Promise<Cliente[]> {
    this.logger.log('Buscando todos os clientes');
    try {
      const clientes = await this.clienteRepository.findAllClients();
      if (clientes.length === 0) {
        this.logger.warn('A lista de clientes está vazia');
        throw new NotFoundException('Nenhum cliente encontrado.');
      }
      return clientes;
    } catch (error) {
      this.logger.error(`Erro ao buscar clientes: ${error.message}`);
      throw error;
    }
  }

  async validarTipoCliente(tipo: string): Promise<void> {
    if (!this.tipos.includes(tipo)) {
      this.logger.warn(`Tipo de cliente inválido: ${tipo}`);
      throw new ConflictException(
        `Tipo de cliente inválido. Permitidos: ${this.tipos.join(', ')}`,
      );
    }
  }

  private async hashSenha(senha: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(senha, salt);
  }
}
