import { Test, TestingModule } from '@nestjs/testing';
import { ClientesController } from './clientes.controller';
import { ClientesService } from '../service/clientes.service';
import { AuthGuard } from '../../auth/guard/auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { TipoCliente } from '../entities/cliente.entity';

describe('ClientesController', () => {
  let controller: ClientesController;
  let clientesService: ClientesService;

  const mockClientesService = {
    createClient: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientesController],
      providers: [
        {
          provide: ClientesService,
          useValue: mockClientesService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ClientesController>(ClientesController);
    clientesService = module.get<ClientesService>(ClientesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createClienteDto = {
      nome: 'José Pereira',
      email: 'email.jose@gmail.com',
      senha: 'senha123',
      tipo: TipoCliente.CLIENTE,
    };

    const createdCliente = {
      id: 1,
      ...createClienteDto,
      compras: [],
      createdAt: new Date(),
    };

    it('Deve criar um novo cliente', async () => {
      mockClientesService.createClient.mockResolvedValue(createdCliente);

      const result = await controller.create(
        createClienteDto,
        TipoCliente.CLIENTE,
      );

      expect(result).toBe(createdCliente);
      expect(clientesService.createClient).toHaveBeenCalledWith(
        createClienteDto,
        TipoCliente.CLIENTE, // Corrigido para incluir o parâmetro tipo
      );
      expect(clientesService.createClient).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    const clientes = [
      {
        id: 1,
        nome: 'José Pereira',
        email: 'email.jose@gmail.com',
        senha: 'senha123',
        tipo: TipoCliente.CLIENTE,
        compras: [],
        createdAt: new Date(),
      },
      {
        id: 2,
        nome: 'Maria Silva',
        email: 'email.maria@gmail.com',
        senha: 'senha456',
        tipo: TipoCliente.CLIENTE,
        compras: [],
        createdAt: new Date(),
      },
    ];

    it('Deve retornar um array com todos os clientes', async () => {
      mockClientesService.findAll.mockResolvedValue(clientes);

      const result = await controller.findAll();

      expect(result).toBe(clientes);
      expect(clientesService.findAll).toHaveBeenCalled();
      expect(clientesService.findAll).toHaveBeenCalledTimes(1);
    });
  });
});
