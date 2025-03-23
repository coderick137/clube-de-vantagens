import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PagamentoRepository } from '../repository/pagamento.repository';
import { CompraRepository } from '../../compras/repositories/compra.repository';
import { Pagamento } from '../entities/pagamento.entity';
import { CompraStatus } from '../../compras/entities/compra.entity';

@Injectable()
export class PagamentoService {
  private readonly logger = new Logger(PagamentoService.name);

  constructor(
    private readonly pagamentoRepository: PagamentoRepository,
    private readonly compraRepository: CompraRepository,
  ) {}

  async simulatePayment(compraId: number): Promise<Pagamento> {
    this.logger.log(
      `Iniciando simulação de pagamento para compraId: ${compraId}`,
    );

    const compra = await this.compraRepository.findOne({
      where: { id: compraId },
      relations: ['produtos', 'cliente'],
    });

    if (!compra) {
      this.logger.error(`Compra com id ${compraId} não encontrada`);
      throw new NotFoundException('Compra não encontrada');
    }

    try {
      const pagamento =
        await this.pagamentoRepository.simulatePayment(compraId);

      compra.status = CompraStatus.PAGO;
      await this.compraRepository.save(compra);

      this.logger.log(
        `Pagamento simulado com sucesso para compraId: ${compraId}`,
      );
      return pagamento;
    } catch (error) {
      this.logger.error(
        `Erro ao simular pagamento para compraId: ${compraId}`,
        error.stack,
      );
      throw error;
    }
  }
}
