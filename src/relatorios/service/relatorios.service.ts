import { Injectable, Logger } from '@nestjs/common';
import { CreateRelatorioDto } from '../dto/create-relatorio.dto';
import { RelatorioVendasRepository } from '../repository/relatorio-vendas.repository';
import { RelatorioVendaResponseDto } from '../dto/relatorio-venda-response';

@Injectable()
export class RelatoriosService {
  private readonly logger = new Logger(RelatoriosService.name);

  constructor(
    private readonly relatorioRepository: RelatorioVendasRepository,
  ) {}

  async gerarRelatorioVenda(
    filtros: CreateRelatorioDto,
  ): Promise<RelatorioVendaResponseDto> {
    this.logger.log(`Iniciando geração de relatório com filtros: ${JSON.stringify(filtros)}`);
    try {
      const { compras, totalVendas, totalReceita } =
        await this.relatorioRepository.gerarRelatorioVenda(filtros);
      const response: RelatorioVendaResponseDto = {
        message: 'Relatório gerado com sucesso',
        compras: compras.map((compra) => ({
          produtos: compra.produtos.map((produto) => ({
            produtoId: produto.produtoId,
            quantidade: produto.quantidade,
          })),
          status: compra.status,
        })),
        totalVendas,
        totalReceita,
      };
      this.logger.log('Relatório gerado com sucesso');
      return response;
    } catch (error) {
      this.logger.error('Erro ao gerar relatório de vendas', error.stack);
      throw error;
    }
  }
}
