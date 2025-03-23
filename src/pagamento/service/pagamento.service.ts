import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PagamentoRepository } from '../repository/pagamento.repository';
import { Pagamento } from '../entities/pagamento.entity';
import { CompraStatus } from '../../compras/entities/compra.entity';

@Injectable()
export class PagamentoService {
  private readonly logger = new Logger(PagamentoService.name);

  constructor(private readonly pagamentoRepository: PagamentoRepository) {}

  async simulatePayment(compraId: number): Promise<Pagamento> {
    const timestamp = new Date().toISOString();
    this.logger.log(
      `[${timestamp}] Iniciando simulação de pagamento para compraId: ${compraId}`,
    );

    const compra = await this.pagamentoRepository.findCompraById(compraId);

    if (!compra) {
      this.logger.error(
        `[${timestamp}] Compra com id ${compraId} não encontrada. Operação abortada.`,
      );
      throw new NotFoundException('Compra não encontrada');
    }

    try {
      const pagamento = await this.pagamentoRepository.createPagamento(compra);

      await this.pagamentoRepository.updateCompraStatus(
        compra,
        CompraStatus.PAGO,
      );

      this.logger.log(
        `[${timestamp}] Pagamento simulado com sucesso para compraId: ${compraId}. Status atualizado para ${CompraStatus.PAGO}.`,
      );
      return pagamento;
    } catch (error) {
      this.logger.error(
        `[${timestamp}] Erro ao simular pagamento para compraId: ${compraId}. Detalhes do erro: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
