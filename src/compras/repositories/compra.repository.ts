import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Compra } from '../entities/compra.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCompraDto } from '../dto/create-compra.dto';

@Injectable()
export class CompraRepository extends Repository<Compra> {
  constructor(
    @InjectRepository(Compra)
    private readonly compraRepository: Repository<Compra>,
  ) {
    super(
      compraRepository.target,
      compraRepository.manager,
      compraRepository.queryRunner,
    );
  }

  async createCompra(
    createCompraDto: CreateCompraDto,
    clienteId: number,
  ): Promise<Compra> {
    const { produtos, status } = createCompraDto;

    const compra = this.compraRepository.create({
      cliente: { id: clienteId },
      produtos: produtos.map((produto) => ({
        produto: { id: produto.produtoId },
        quantidade: produto.quantidade,
      })),
      status,
    });

    return await this.compraRepository.save(compra);
  }

  async listClientPurchases(clienteId: number) {
    return this.compraRepository.find({
      where: { cliente: { id: clienteId } },
      relations: ['produtos', 'produtos.produto', 'cliente'],
    });
  }
}
