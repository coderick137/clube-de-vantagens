import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Cliente } from '../entities/cliente.entity';
import { CreateClienteDto } from '../dto/create-cliente.dto';
import { UpdateClienteDto } from '../dto/update-cliente.dto';
import { IClienteRepository } from '../interfaces/IClienteRepository';

@Injectable()
export class ClienteRepository
  extends Repository<Cliente>
  implements IClienteRepository
{
  constructor(private readonly dataSource: DataSource) {
    super(Cliente, dataSource.createEntityManager());
  }

  async createClient(dto: CreateClienteDto): Promise<Cliente> {
    const cliente = this.create({
      ...dto,
      tipo: dto.tipo as 'admin' | 'cliente',
    });

    return await this.save(cliente);
  }

  async findAllClients(): Promise<Cliente[]> {
    return await this.find();
  }

  async findByEmail(email: string): Promise<Cliente | undefined> {
    const cliente = await this.createQueryBuilder('cliente')
      .where('cliente.email = :email', { email })
      .getOne();
    return cliente ?? undefined;
  }
}
