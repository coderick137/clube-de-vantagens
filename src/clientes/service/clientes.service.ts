import { ConflictException, Injectable, Logger } from '@nestjs/common';

import * as bcrypt from 'bcryptjs';
import { CreateClienteDto } from '../dto/create-cliente.dto';
import { UpdateClienteDto } from '../dto/update-cliente.dto';
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

      const novoCliente = this.clienteRepository.create({
        nome,
        email,
        senha: senhaHash,
        tipo,
      });

      return this.clienteRepository.save(novoCliente);
    } catch (error) {
      this.logger.error(`Erro ao criar cliente: ${error.message}`);
      throw error;
    } finally {
      this.logger.log(`Cliente criado com sucesso: ${createClienteDto.nome}`);
    }
  }

  findAll() {
    return `This action returns all clientes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cliente`;
  }

  update(id: number, updateClienteDto: UpdateClienteDto) {
    return `This action updates a #${id} cliente`;
  }

  remove(id: number) {
    return `This action removes a #${id} cliente`;
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
