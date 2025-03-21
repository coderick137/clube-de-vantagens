import { CreateClienteDto } from '../dto/create-cliente.dto';
import { UpdateClienteDto } from '../dto/update-cliente.dto';
import { Cliente } from '../entities/cliente.entity';

export interface IClienteRepository {
  createClient(dto: CreateClienteDto): Promise<Cliente>;
  findAllClients(): Promise<Cliente[]>;
  findClientById(id: number): Promise<Cliente>;
  updateClient(id: number, dto: UpdateClienteDto): Promise<Cliente>;
  deleteClient(id: number): Promise<void>;
}
