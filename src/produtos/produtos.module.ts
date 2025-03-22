import { Module } from '@nestjs/common';
import { ProdutosController } from './controller/produtos.controller';
import { ProdutosService } from './service/produtos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Produto } from './entities/produto.entity';
import { ProdutoRepository } from './repository/produto.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Produto])],
  controllers: [ProdutosController],
  providers: [ProdutosService, ProdutoRepository],
  exports: [ProdutosService, ProdutoRepository],
})
export class ProdutosModule {}
