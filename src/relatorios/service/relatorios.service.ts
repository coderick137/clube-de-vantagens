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
    const timestamp = new Date().toISOString();
    this.logger.log(
      `[${timestamp}] Iniciando geração de relatório com filtros: ${JSON.stringify(filtros)}`,
    );
    try {
      const relatorio =
        await this.relatorioRepository.gerarRelatorioVenda(filtros);
      this.logger.log(`[${timestamp}] Relatório gerado com sucesso`);
      return relatorio;
    } catch (error) {
      this.logger.error(
        `[${timestamp}] Erro ao gerar relatório de vendas: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async getAll(): Promise<RelatorioVendaResponseDto[]> {
    const timestamp = new Date().toISOString();
    this.logger.log(`[${timestamp}] Recuperando todos os relatórios de vendas`);
    try {
      const relatorios = await this.relatorioRepository.getRelatoriosVendas();
      this.logger.log(`[${timestamp}] Relatórios recuperados com sucesso`);
      return relatorios;
    } catch (error) {
      this.logger.error(
        `[${timestamp}] Erro ao recuperar relatórios de vendas: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
