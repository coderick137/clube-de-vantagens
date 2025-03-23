import { CreateRelatorioDto } from '../dto/create-relatorio.dto';
import { RelatorioVendasRepository } from '../repository/relatorio-vendas.repository';
import { RelatoriosService } from './relatorios.service';

describe('RelatoriosService', () => {
  let service: RelatoriosService;
  let relatorioRepository: jest.Mocked<RelatorioVendasRepository>;

  beforeEach(() => {
    relatorioRepository = {
      gerarRelatorioVenda: jest.fn(),
    } as unknown as jest.Mocked<RelatorioVendasRepository>;

    service = new RelatoriosService(relatorioRepository);
  });

  describe('gerarRelatorioVenda', () => {
    it('should generate a sales report successfully', async () => {
      const filtros: CreateRelatorioDto = {
        dataInicio: '2025-03-01',
        dataFim: '2025-03-31',
      };
      const mockResponse = {
        message: 'Relatório gerado com sucesso',
        compras: [
          {
            produtos: [
              { produtoId: 1, quantidade: 2 },
              { produtoId: 2, quantidade: 1 },
            ],
            status: 'completed',
          },
        ],
        totalVendas: 3,
        totalReceita: 100,
      };

      relatorioRepository.gerarRelatorioVenda.mockResolvedValue(mockResponse);

      const result = await service.gerarRelatorioVenda(filtros);

      expect(relatorioRepository.gerarRelatorioVenda).toHaveBeenCalledWith(
        filtros,
      );
      expect(result).toEqual({
        message: 'Relatório gerado com sucesso',
        compras: [
          {
            produtos: [
              { produtoId: 1, quantidade: 2 },
              { produtoId: 2, quantidade: 1 },
            ],
            status: 'completed',
          },
        ],
        totalVendas: 3,
        totalReceita: 100,
      });
    });

    it('should log an error and throw if repository throws an error', async () => {
      const filtros: CreateRelatorioDto = {
        dataInicio: '2025-03-01',
        dataFim: '2025-03-31',
      };
      const error = new Error('Repository error');

      relatorioRepository.gerarRelatorioVenda.mockRejectedValue(error);

      await expect(service.gerarRelatorioVenda(filtros)).rejects.toThrow(error);
      expect(relatorioRepository.gerarRelatorioVenda).toHaveBeenCalledWith(
        filtros,
      );
    });
  });
});
