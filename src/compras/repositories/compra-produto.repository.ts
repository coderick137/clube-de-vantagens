import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompraProduto } from '../entities/compra-produto.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CompraProdutoRepository extends Repository<CompraProduto> {
  constructor(
    @InjectRepository(CompraProduto)
    private readonly compraProdutoRepository: Repository<CompraProduto>,
  ) {
    super(
      compraProdutoRepository.target,
      compraProdutoRepository.manager,
      compraProdutoRepository.queryRunner,
    );
  }

  async createCompraProduto(
    compraId: number,
    produtoId: number,
    quantidade: number,
  ): Promise<CompraProduto> {
    const compraProduto = this.compraProdutoRepository.create({
      compra: { id: compraId },
      produto: { id: produtoId },
      quantidade,
    });

    return await this.compraProdutoRepository.save(compraProduto);
  }
}
