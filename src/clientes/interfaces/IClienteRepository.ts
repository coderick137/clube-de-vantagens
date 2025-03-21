import { CreateClienteDto } from '../dto/create-cliente.dto';
import { UpdateClienteDto } from '../dto/update-cliente.dto';
import { Cliente } from '../entities/cliente.entity';

export interface IClienteRepository {
  createClient(dto: CreateClienteDto): Promise<Cliente>;
  findAllClients(): Promise<Cliente[]>;
  findByEmail(email: string): Promise<Cliente | undefined>;
}
