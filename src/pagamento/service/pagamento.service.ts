import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePagamentoDto } from '../dto/create-pagamento.dto';
import { UpdatePagamentoDto } from '../dto/update-pagamento.dto';
import { PagamentoRepository } from '../repository/pagamento.repository';
import { CompraRepository } from '../../compras/repositories/compra.repository';
import { Pagamento } from '../entities/pagamento.entity';
import { CompraStatus } from '../../compras/entities/compra.entity';

@Injectable()
export class PagamentoService {
  constructor(
    private readonly pagamentoRepository: PagamentoRepository,
    private readonly compraRepository: CompraRepository,
  ) {}

  async simulatePayment(compraId: number): Promise<Pagamento> {
    const compra = await this.compraRepository.findOne({
      where: { id: compraId },
      relations: ['produtos', 'cliente'],
    });

    if (!compra) {
      throw new NotFoundException('Compra não encontrada');
    }

    const pagamento = await this.pagamentoRepository.simulatePayment(compraId);

    compra.status = CompraStatus.PAGO;
    await this.compraRepository.save(compra);

    return pagamento;
  }
}
