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

  async findCompraById(compraId: number): Promise<Compra | null> {
    return this.compraRepository.findOne({
      where: { id: compraId },
      relations: ['produtos', 'cliente'],
    });
  }

  async createPagamento(compra: Compra): Promise<Pagamento> {
    const pagamento = this.pagamentoRepository.create({
      compra,
      status: 'Pago',
    });
    return this.pagamentoRepository.save(pagamento);
  }

  async updateCompraStatus(compra: Compra, status: CompraStatus): Promise<Compra> {
    compra.status = status;
    return this.compraRepository.save(compra);
  }
}
