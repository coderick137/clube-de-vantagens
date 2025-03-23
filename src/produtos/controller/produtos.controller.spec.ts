import { Test, TestingModule } from '@nestjs/testing';
import { ProdutosController } from './produtos.controller';
import { ProdutosService } from '../service/produtos.service';
import { AuthGuard } from '../../auth/guard/auth.guard';
import { CreateProdutoDto } from '../dto/create-produto.dto';
import { Produto } from '../entities/produto.entity';

describe('ProdutosController', () => {
  let controller: ProdutosController;
  let produtosService: ProdutosService;

  const mockProdutosService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProdutosController],
      providers: [
        {
          provide: ProdutosService,
          useValue: mockProdutosService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ProdutosController>(ProdutosController);
    produtosService = module.get<ProdutosService>(ProdutosService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createProdutoDto: CreateProdutoDto = {
      nome: 'Produto 1',
      preco: 100,
      descricao: '',
      categoria: '',
    };

    const createdProduto: Produto = {
      id: 1,
      ...createProdutoDto,
      comprasProduto: [],
      createdAt: new Date(),
    };

    it('should create a new product successfully', async () => {
      mockProdutosService.create.mockResolvedValue(createdProduto);

      const result = await controller.create(createProdutoDto);

      expect(result).toEqual(createdProduto); // Altere para verificar apenas o produto criado
      expect(produtosService.create).toHaveBeenCalledWith(createProdutoDto);
      expect(produtosService.create).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if product creation fails', async () => {
      mockProdutosService.create.mockRejectedValue(
        new Error('Creation failed'),
      );

      await expect(controller.create(createProdutoDto)).rejects.toThrow(
        'Creation failed',
      );
      expect(produtosService.create).toHaveBeenCalledWith(createProdutoDto);
      expect(produtosService.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    const page = 1;
    const limit = 10;
    const filters = { category: 'electronics' };
    const mockResponse = {
      data: [{ id: '1', nome: 'Produto 1', preco: 100 }],
      total: 1,
    };

    it('should return a paginated list of products', async () => {
      mockProdutosService.findAll.mockResolvedValue(mockResponse);

      const result = await controller.findAll(page, limit, filters);

      expect(result).toEqual(mockResponse);
      expect(produtosService.findAll).toHaveBeenCalledWith(
        page,
        limit,
        filters,
      );
      expect(produtosService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if fetching products fails', async () => {
      mockProdutosService.findAll.mockRejectedValue(new Error('Fetch failed'));

      await expect(controller.findAll(page, limit, filters)).rejects.toThrow(
        'Fetch failed',
      );
      expect(produtosService.findAll).toHaveBeenCalledWith(
        page,
        limit,
        filters,
      );
      expect(produtosService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    const id = '1';
    const mockProduto: Produto = {
      id: 1,
      nome: 'Produto 1',
      preco: 100,
      descricao: '',
      categoria: '',
      comprasProduto: [],
      createdAt: new Date(),
    };

    it('should return a product by ID', async () => {
      mockProdutosService.findOne.mockResolvedValue(mockProduto);

      const result = await controller.findOne(id);

      expect(result).toEqual(mockProduto);
      expect(produtosService.findOne).toHaveBeenCalledWith(id);
      expect(produtosService.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if product is not found', async () => {
      mockProdutosService.findOne.mockRejectedValue(new Error('Not found'));

      await expect(controller.findOne(id)).rejects.toThrow('Not found');
      expect(produtosService.findOne).toHaveBeenCalledWith(id);
      expect(produtosService.findOne).toHaveBeenCalledTimes(1);
    });
  });
});
