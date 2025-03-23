import { Test, TestingModule } from '@nestjs/testing';
import { CategoriaEnum, ProdutosService } from './produtos.service';
import { ProdutoRepository } from '../repository/produto.repository';
import { CreateProdutoDto } from '../dto/create-produto.dto';
import { NotFoundException, Logger } from '@nestjs/common';
import { CompraProduto } from '../../compras/entities/compra-produto.entity';

describe('ProdutosService', () => {
  let service: ProdutosService;
  let produtoRepository: ProdutoRepository;

  const mockProdutoRepository = {
    createProduct: jest.fn(),
    findAllProducts: jest.fn(),
    findById: jest.fn(),
  };

  const mockLogger = () => {
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => {});
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutosService,
        {
          provide: ProdutoRepository,
          useValue: mockProdutoRepository,
        },
      ],
    }).compile();

    service = module.get<ProdutosService>(ProdutosService);
    produtoRepository = module.get<ProdutoRepository>(ProdutoRepository);

    mockLogger();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createProdutoDto: CreateProdutoDto = {
      nome: 'Produto Teste',
      preco: 100,
      descricao: 'Descrição do produto teste',
      categoria: CategoriaEnum.ELETRODOMESTICOS,
    };

    it('should create a product successfully', async () => {
      const produto = {
        id: 1,
        ...createProdutoDto,
        comprasProduto: [],
        createdAt: new Date(),
      };

      jest.spyOn(produtoRepository, 'createProduct').mockResolvedValue(produto);

      const result = await service.create(createProdutoDto);

      expect(result).toBe(produto);
      expect(produtoRepository.createProduct).toHaveBeenCalledWith(
        createProdutoDto,
      );
    });

    it('should throw an error if product creation fails', async () => {
      const error = new Error('Erro ao criar produto');
      jest.spyOn(produtoRepository, 'createProduct').mockRejectedValue(error);

      await expect(service.create(createProdutoDto)).rejects.toThrow(error);
    });
  });

  describe('findAll', () => {
    it('should return a list of products with pagination and filters', async () => {
      const page = 1;
      const limit = 10;
      const filters = CategoriaEnum.ELETRODOMESTICOS;
      const produtos = [
        {
          id: 1,
          nome: 'Produto Teste 1',
          preco: 100,
          descricao: 'Descrição 1',
          categoria: CategoriaEnum.ELETRODOMESTICOS,
          comprasProduto: [],
          createdAt: new Date(),
        },
        {
          id: 2,
          nome: 'Produto Teste 2',
          preco: 200,
          descricao: 'Descrição 2',
          categoria: CategoriaEnum.ELETRONICOS,
          comprasProduto: [],
          createdAt: new Date(),
        },
      ];
      const result = {
        data: produtos,
        page,
        limit,
        total: produtos.length,
      };

      jest
        .spyOn(produtoRepository, 'findAllProducts')
        .mockResolvedValue(result);

      const response = await service.findAll(page, limit, filters);

      expect(response).toBe(result);
      expect(produtoRepository.findAllProducts).toHaveBeenCalledWith(
        page,
        limit,
        filters,
      );
    });
  });

  describe('findOne', () => {
    const id = '1';

    it('should return a product by ID', async () => {
      const produto = {
        id: 1,
        nome: 'Produto Teste',
        preco: 100,
        descricao: 'Descrição do produto teste',
        categoria: '',
        comprasProduto: [] as CompraProduto[],
        createdAt: new Date(),
      };

      jest.spyOn(produtoRepository, 'findById').mockResolvedValue(produto);

      const result = await service.findOne(id);

      expect(result).toBe(produto);
      expect(produtoRepository.findById).toHaveBeenCalledWith(+id);
    });

    it('should throw NotFoundException if product is not found', async () => {
      jest
        .spyOn(produtoRepository, 'findById')
        .mockResolvedValue(undefined as any);

      await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
      expect(produtoRepository.findById).toHaveBeenCalledWith(+id);
    });

    it('should throw an error if fetching product fails', async () => {
      const error = new Error('Erro ao buscar produto');
      jest.spyOn(produtoRepository, 'findById').mockRejectedValue(error);

      await expect(service.findOne(id)).rejects.toThrow(error);
    });
  });
});
