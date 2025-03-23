import { Test, TestingModule } from '@nestjs/testing';
import { RelatoriosController } from './relatorios.controller';
import { RelatoriosService } from '../service/relatorios.service';
import { CreateRelatorioDto } from '../dto/create-relatorio.dto';
import { RelatorioVendaResponseDto } from '../dto/relatorio-venda-response';
import { AuthGuard } from '../../auth/guard/auth.guard';

describe('RelatoriosController', () => {
  let controller: RelatoriosController;
  let relatoriosService: RelatoriosService;

  const mockRelatoriosService = {
    gerarRelatorioVenda: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RelatoriosController],
      providers: [
        {
          provide: RelatoriosService,
          useValue: mockRelatoriosService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<RelatoriosController>(RelatoriosController);
    relatoriosService = module.get<RelatoriosService>(RelatoriosService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('gerarRelatorio', () => {
    const filtro: CreateRelatorioDto = {
      dataInicio: '2025-03-01',
      dataFim: '2025-03-31',
    };

    const response: RelatorioVendaResponseDto = {
      totalVendas: 100,
      totalReceita: 1000,
      message: '',
      compras: [],
    };

    it('Deve chamar relatoriosService.gerarRelatorioVenda com os parâmetros corretos', async () => {
      mockRelatoriosService.gerarRelatorioVenda.mockResolvedValue(response);

      const result = await controller.gerarRelatorio(filtro);

      expect(result).toBe(response);
      expect(relatoriosService.gerarRelatorioVenda).toHaveBeenCalledWith(
        filtro,
      );
      expect(relatoriosService.gerarRelatorioVenda).toHaveBeenCalledTimes(1);
    });

    it('Deve lançar um erro se relatoriosService.gerarRelatorioVenda falhar', async () => {
      mockRelatoriosService.gerarRelatorioVenda.mockRejectedValue(
        new Error('Service error'),
      );

      await expect(controller.gerarRelatorio(filtro)).rejects.toThrow(
        'Service error',
      );
    });
  });
});
