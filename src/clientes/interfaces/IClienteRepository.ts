import { CreateClienteDto } from '../dto/create-cliente.dto';
import { Cliente, TipoCliente } from '../entities/cliente.entity';

export interface IClienteRepository {
  createClient(
    dto: CreateClienteDto,
    tipoCliente: TipoCliente,
  ): Promise<Cliente>;
  findAllClients(): Promise<Cliente[]>;
  findByEmail(email: string): Promise<Cliente | undefined>;
}
