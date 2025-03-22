import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pagamento } from '../entities/pagamento.entity';
import { Compra, CompraStatus } from '../../compras/entities/compra.entity';

@Injectable()
export class PagamentoRepository {
  constructor(
    @InjectRepository(Pagamento)
    private readonly pagamentoRepository: Repository<Pagamento>,
    @InjectRepository(Compra)
    private readonly compraRepository: Repository<Compra>,
  ) {}

  async simulatePayment(compraId: number): Promise<Pagamento> {
    const compra = await this.compraRepository.findOne({
      where: { id: compraId },
      relations: ['produtos', 'cliente'],
    });

    if (!compra) {
      throw new NotFoundException('Compra não encontrada');
    }

    const pagamento = this.pagamentoRepository.create({
      compra,
      status: 'Pago',
    });

    await this.pagamentoRepository.save(pagamento);

    compra.status = CompraStatus.PAGO;
    await this.compraRepository.save(compra);

    return pagamento;
  }
}
