import { Test, TestingModule } from '@nestjs/testing';
import { ComprasService } from './compras.service';
import { CompraRepository } from '../repositories/compra.repository';
import { CompraProdutoRepository } from '../repositories/compra-produto.repository';
import { CreateCompraDto } from '../dto/create-compra.dto';
import { Compra, CompraStatus } from '../entities/compra.entity';
import { Cliente } from '../../clientes/entities/cliente.entity';
import { Produto } from '../../produtos/entities/produto.entity';

describe('ComprasService', () => {
  let service: ComprasService;
  let compraRepository: jest.Mocked<CompraRepository>;
  let compraProdutoRepository: jest.Mocked<CompraProdutoRepository>;

  beforeEach(async () => {
    compraRepository = {
      createCompra: jest.fn(),
      findOne: jest.fn(),
      listClientPurchases: jest.fn(),
    } as unknown as jest.Mocked<CompraRepository>;

    compraProdutoRepository = {
      createCompraProduto: jest.fn(),
    } as unknown as jest.Mocked<CompraProdutoRepository>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ComprasService,
        { provide: CompraRepository, useValue: compraRepository },
        { provide: CompraProdutoRepository, useValue: compraProdutoRepository },
      ],
    }).compile();

    service = module.get<ComprasService>(ComprasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('cria compra', () => {
    const createCompraDto: CreateCompraDto = {
      produtos: [{ produtoId: 1, quantidade: 2 }],
      status: CompraStatus.PENDENTE,
    };
    const clienteId = 1;

    it('deve criar uma compra e retornar o resultado', async () => {
      const mockCompra = {
        id: 1,
        cliente: { id: clienteId } as Cliente,
        produtos: [],
        status: CompraStatus.PENDENTE,
        createdAt: new Date(),
      };
      const mockResult = { ...mockCompra };

      compraRepository.createCompra.mockResolvedValue(mockCompra);
      compraRepository.findOne.mockResolvedValue(mockResult);

      const result = await service.create(createCompraDto, clienteId);

      expect(compraRepository.createCompra).toHaveBeenCalledWith(
        createCompraDto,
        clienteId,
      );
      expect(compraProdutoRepository.createCompraProduto).toHaveBeenCalledWith(
        mockCompra.id,
        1,
        2,
      );
      expect(compraRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockCompra.id },
        relations: ['produtos', 'produtos.produto', 'cliente'],
      });
      expect(result).toEqual(mockResult);
    });

    it('deve lançar um erro se a criação falhar', async () => {
      compraRepository.createCompra.mockRejectedValue(new Error('Erro'));

      await expect(service.create(createCompraDto, clienteId)).rejects.toThrow(
        'Erro',
      );
      expect(compraRepository.createCompra).toHaveBeenCalledWith(
        createCompraDto,
        clienteId,
      );
    });
  });

  describe('Lista compras do cliente', () => {
    const clienteId = 1;

    it('deve listar as compras de um cliente', async () => {
      const mockCompras = [
        {
          id: 1,
          cliente: { id: 1 } as Cliente,
          produtos: [
            {
              id: 1,
              compra: { id: 1 } as Compra,
              produto: { id: 1 } as Produto,
              quantidade: 2,
              createdAt: new Date(),
            },
            {
              id: 2,
              compra: { id: 1 } as Compra,
              produto: { id: 2 } as Produto,
              quantidade: 3,
              createdAt: new Date(),
            },
          ],
          status: CompraStatus.PENDENTE,
          createdAt: new Date(),
        },
      ];

      compraRepository.listClientPurchases.mockResolvedValue(mockCompras);

      const result = await service.listClientPurchases(clienteId);

      expect(compraRepository.listClientPurchases).toHaveBeenCalledWith(
        clienteId,
      );
      expect(result).toEqual([
        {
          id: 1,
          status: CompraStatus.PENDENTE,
          clienteId,
          produtos: [
            { produtoId: 1, quantidade: 2 },
            { produtoId: 2, quantidade: 3 },
          ],
        },
      ]);
    });

    it('deve lançar um erro se a listagem falhar', async () => {
      compraRepository.listClientPurchases.mockRejectedValue(new Error('Erro'));

      await expect(service.listClientPurchases(clienteId)).rejects.toThrow(
        'Erro',
      );
      expect(compraRepository.listClientPurchases).toHaveBeenCalledWith(
        clienteId,
      );
    });
  });
});
