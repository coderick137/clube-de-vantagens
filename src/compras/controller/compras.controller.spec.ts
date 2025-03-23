import { Test, TestingModule } from '@nestjs/testing';
import { ComprasController } from './compras.controller';
import { ComprasService } from '../service/compras.service';
import { AuthGuard } from '../../auth/guard/auth.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { CompraStatus } from '../entities/compra.entity';

describe('ComprasController', () => {
  let controller: ComprasController;
  let comprasService: ComprasService;

  const mockComprasService = {
    create: jest.fn(),
    listClientPurchases: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComprasController],
      providers: [
        {
          provide: ComprasService,
          useValue: mockComprasService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ComprasController>(ComprasController);
    comprasService = module.get<ComprasService>(ComprasService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createCompraDto = {
      produtos: [{ produtoId: 1, quantidade: 2 }],
      status: CompraStatus.PENDENTE,
    };

    const user = { id: 1 };

    const createdCompra = {
      id: 1,
      status: 'CONFIRMADO',
      cliente: { id: 1 },
      produtos: [
        {
          produto: { id: 1 },
          quantidade: 2,
        },
      ],
    };

    it('Deve criar uma nova compra', async () => {
      mockComprasService.create.mockResolvedValue(createdCompra);

      const result = await controller.create(createCompraDto, user);

      expect(result).toEqual({
        mensagem: 'Compra realizada com sucesso',
        compra: {
          id: createdCompra.id,
          status: createdCompra.status,
          cliente: { id: createdCompra.cliente.id },
          produtos: createdCompra.produtos.map((produto) => ({
            produtoId: produto.produto.id,
            quantidade: produto.quantidade,
          })),
        },
      });
      expect(comprasService.create).toHaveBeenCalledWith(
        createCompraDto,
        user.id,
      );
      expect(comprasService.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    const user = { id: 1 };

    const compras = [
      {
        id: 1,
        status: CompraStatus.PENDENTE,
        cliente: { id: 1 },
        produtos: [
          {
            produto: { id: 1 },
            quantidade: 2,
          },
        ],
      },
      {
        id: 2,
        status: CompraStatus.PAGO,
        cliente: { id: 1 },
        produtos: [
          {
            produto: { id: 2 },
            quantidade: 1,
          },
        ],
      },
    ];

    it('Deve retornar uma lista de compras do cliente logado', async () => {
      mockComprasService.listClientPurchases.mockResolvedValue(compras);

      const result = await controller.findAll(user);

      expect(result).toBe(compras);
      expect(comprasService.listClientPurchases).toHaveBeenCalledWith(user.id);
      expect(comprasService.listClientPurchases).toHaveBeenCalledTimes(1);
    });
  });
});
