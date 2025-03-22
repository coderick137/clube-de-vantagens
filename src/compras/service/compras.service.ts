import { Injectable } from '@nestjs/common';
import { CreateCompraDto } from '../dto/create-compra.dto';
import { CompraRepository } from '../repositories/compra.repository';
import { CompraProdutoRepository } from '../repositories/compra-produto.repository';

@Injectable()
export class ComprasService {
  constructor(
    private readonly comprasRepository: CompraRepository,
    private readonly compraProdutoRepository: CompraProdutoRepository,
  ) {}

  async create(createCompraDto: CreateCompraDto, clienteId: number) {
    const compra = await this.comprasRepository.createCompra(
      createCompraDto,
      clienteId,
    );

    for (const prod of createCompraDto.produtos) {
      await this.compraProdutoRepository.createCompraProduto(
        compra.id,
        prod.produtoId,
        prod.quantidade,
      );
    }

    return this.comprasRepository.findOne({
      where: { id: compra.id },
      relations: ['produtos', 'produtos.produto', 'cliente'],
    });
  }

  async listClientPurchases(clienteId: number) {
    const compras = await this.comprasRepository.listClientPurchases(clienteId);

    return compras.map((compra) => ({
      id: compra.id,
      status: compra.status,
      clienteId: compra.cliente.id,
      produtos: compra.produtos.map((prod) => ({
        produtoId: prod.produto.id,
        quantidade: prod.quantidade,
      })),
    }));
  }
}
