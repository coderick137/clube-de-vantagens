import { Test, TestingModule } from '@nestjs/testing';
import { ClientesService } from './clientes.service';
import { ClienteRepository } from '../repository/cliente.repository';
import { Cliente, TipoCliente } from '../entities/cliente.entity';

const mockArrayClientes: Cliente[] = [
  {
    id: 1,
    nome: 'João Silva',
    email: 'joao.silva@example.com',
    senha: 'senha123',
    tipo: TipoCliente.CLIENTE,
    compras: [],
    createdAt: new Date(),
  },
  {
    id: 2,
    nome: 'Maria Oliveira',
    email: 'maria.oliveira@example.com',
    senha: 'senha456',
    tipo: TipoCliente.CLIENTE,
    compras: [],
    createdAt: new Date(),
  },
];

const mockRepository: Partial<Record<keyof ClienteRepository, jest.Mock>> = {
  createClient: jest.fn(),
  findAllClients: jest.fn(),
  findByEmail: jest.fn(),
};

describe('ClientesService', () => {
  let clienteService: ClientesService;

  const createClienteDto = {
    nome: 'José Pereira',
    email: 'email.jose@gmail.com',
    senha: 'senha123',
    tipo: TipoCliente.CLIENTE,
  };

  const cliente = {
    id: 1,
    ...createClienteDto,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientesService,
        {
          provide: ClienteRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    clienteService = module.get<ClientesService>(ClientesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(clienteService).toBeDefined();
  });

  describe('create', () => {
    it('Deve retornar um novo Cliente criado', async () => {
      const hashedPassword =
        '$2b$10$sfYwbvy3UHD2Z5VJ7k3m0ea.s3uVYA.D0wB5ndpKxZWUznDY77pn2';
      const clienteWithHashedPassword = { ...cliente, senha: hashedPassword };
      mockRepository.createClient!.mockResolvedValue(clienteWithHashedPassword);

      const result = await clienteService.createClient(createClienteDto);
      expect(result).toEqual(clienteWithHashedPassword);
    });

    it('deve lançar uma exceção quando o cliente já existe', async () => {
      mockRepository.findByEmail!.mockResolvedValue(cliente.email);

      await expect(
        clienteService.createClient(createClienteDto),
      ).rejects.toThrow(`Cliente com email ${cliente.email} já existe`);
    });

    it('deve lançar uma exceção quando o tipo de cliente é inválido', async () => {
      const invalidClienteDto = {
        ...createClienteDto,
        tipo: 'invalido' as TipoCliente,
      };

      jest
        .spyOn(clienteService, 'validarTipoCliente')
        .mockImplementation(() => {
          throw new Error('Tipo de cliente inválido');
        });

      await expect(
        clienteService.createClient(invalidClienteDto),
      ).rejects.toThrow('Tipo de cliente inválido');
    });
  });

  describe('findAll', () => {
    it('Deve retornar uma lista com todos os Clientes', async () => {
      mockRepository.findAllClients!.mockResolvedValue(mockArrayClientes);

      const clientes = await clienteService.findAll();
      expect(clientes).toEqual(mockArrayClientes);
      expect(mockRepository.findAllClients).toHaveBeenCalledTimes(1);
    });

    it('Deve retornar um erro ao buscar todos os Clientes', async () => {
      mockRepository.findAllClients!.mockRejectedValueOnce(new Error());

      await expect(clienteService.findAll()).rejects.toThrow();
    });
  });
});
