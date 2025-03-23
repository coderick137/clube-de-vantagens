import { Injectable } from '@nestjs/common';
import { CreateRelatorioDto } from '../dto/create-relatorio.dto';
import { RelatorioVendasRepository } from '../repository/relatorio-vendas.repository';
import { RelatorioVendaResponseDto } from '../dto/relatorio-venda-response';

@Injectable()
export class RelatoriosService {
  constructor(
    private readonly relatorioRepository: RelatorioVendasRepository,
  ) {}

  async gerarRelatorioVenda(
    filtros: CreateRelatorioDto,
  ): Promise<RelatorioVendaResponseDto> {
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

    return response;
  }
}
