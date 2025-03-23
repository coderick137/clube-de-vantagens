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
  {
    id: 2,
    nome: 'Carlos Souza',
    email: 'carlos.souza@example.com',
    senha: 'senha789',
    tipo: TipoCliente.ADMIN,
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
  let clienteRepository: ClienteRepository;

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
    clienteRepository = module.get<ClienteRepository>(ClienteRepository);
  });

  it('should be defined', () => {
    expect(clienteService).toBeDefined();
    expect(clienteRepository).toBeDefined();
  });

  describe('create', () => {
    it('Deve retornar um novo Cliente criado', async () => {
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
      mockRepository.createClient!.mockResolvedValue(cliente);

      const result = await clienteService.createClient(createClienteDto);
      expect(result).toEqual(cliente);
      expect(mockRepository.createClient).toHaveBeenCalled();
    });
    it('deve lançar uma exceção quando o cliente já existe', async () => {
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
      mockRepository.findByEmail!.mockResolvedValue(cliente.email);
      await expect(clienteService.createClient(createClienteDto)).rejects.toThrow(
        `Cliente com email ${cliente.email} já existe`,
      );
    });
    it('deve lançar uma exceção quando o tipo de cliente é inválido', async () => {
      const createClienteDto = {
        nome: 'José Pereira',
        email: 'email.jose@gmail.com',
        senha: 'senha123',
        tipo: 'invalido' as TipoCliente, // Tipo inválido
      };

      jest
        .spyOn(clienteService, 'validarTipoCliente')
        .mockImplementation(() => {
          throw new Error('Tipo de cliente inválido');
        });

      await expect(clienteService.createClient(createClienteDto)).rejects.toThrow(
        'Tipo de cliente inválido',
      );
    });
  });

  describe('findAll', () => {
    it('Deve retornar uma lista com todos os Clientes', async () => {
      mockRepository.findAllClients!.mockResolvedValue(mockArrayClientes);

      const clientes = await clienteService.findAll();
      expect(clientes).toEqual(mockArrayClientes);
      expect(mockRepository.findAllClients).toHaveBeenCalledTimes(1);
    });

    it('Deve retornar um erro ao buscar todos os Clientes', () => {
      jest
        .spyOn(clienteRepository, 'findAllClients')
        .mockRejectedValueOnce(new Error());

      void expect(clienteService.findAll()).rejects.toThrow();
    });
  });
});
