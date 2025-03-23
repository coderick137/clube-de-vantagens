import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Compra } from '../../compras/entities/compra.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRelatorioDto } from '../dto/create-relatorio.dto';
import { RelatorioVendaResponseDto } from '../dto/relatorio-venda-response';

@Injectable()
export class RelatorioVendasRepository {
  constructor(
    @InjectRepository(Compra)
    private readonly compraRepository: Repository<Compra>,
  ) {}

  async gerarRelatorioVenda(
    filtros: CreateRelatorioDto,
  ): Promise<RelatorioVendaResponseDto> {
    const { dataInicio, dataFim } = filtros;

    const dataInicioFormatada = dataInicio
      ? `${dataInicio.split('/').reverse().join('-')} 00:00:00`
      : null;
    const dataFimFormatada = dataFim
      ? `${dataFim.split('/').reverse().join('-')} 23:59:59`
      : null;

    const queryBuilder = this.compraRepository
      .createQueryBuilder('compras')
      .select([
        'compras.id AS "compraId"',
        'compras."createdAt" AS "compraData"',
        'produtos.id AS "produtoId"',
        'produtos.nome AS "produtoNome"',
        'produtos.preco AS "produtoPreco"',
        'compras_produtos.quantidade AS "produtoQuantidade"',
        'COUNT(compras.id) OVER () AS "totalVendas"',
        'SUM(produtos.preco * compras_produtos.quantidade) OVER () AS "totalReceita"',
      ])
      .leftJoin(
        'compras_produtos',
        'compras_produtos',
        'compras.id = compras_produtos."compraId"',
      )
      .leftJoin(
        'produtos',
        'produtos',
        'compras_produtos."produtoId" = produtos.id',
      )
      .where('compras.id IS NOT NULL');

    if (dataInicioFormatada) {
      queryBuilder.andWhere('compras."createdAt" >= :dataInicio', {
        dataInicio: dataInicioFormatada,
      });
    }
    if (dataFimFormatada) {
      queryBuilder.andWhere('compras."createdAt" <= :dataFim', {
        dataFim: dataFimFormatada,
      });
    }

    queryBuilder.groupBy(
      'compras.id, compras."createdAt", produtos.id, produtos.nome, produtos.preco, compras_produtos.quantidade, produtos.preco',
    );

    const compras = await queryBuilder.getRawMany();

    const comprasFormatadas = compras.map((compra) => ({
      produtos: [
        {
          produtoId: compra.produtoId,
          quantidade: compra.produtoQuantidade,
        },
      ],
      status: 'Pago',
    }));

    return {
      message: 'Relatório gerado com sucesso',
      compras: comprasFormatadas,
      totalVendas: compras.length > 0 ? Number(compras[0].totalVendas) : 0,
      totalReceita: compras.length > 0 ? Number(compras[0].totalReceita) : 0,
    };
  }

  async getRelatoriosVendas(): Promise<RelatorioVendaResponseDto[]> {
    const relatorios = await this.compraRepository
      .createQueryBuilder('compras')
      .select([
        'compras.id AS "compraId"',
        'compras."createdAt" AS "compraData"',
        'produtos.id AS "produtoId"',
        'produtos.nome AS "produtoNome"',
        'produtos.preco AS "produtoPreco"',
        'compras_produtos.quantidade AS "produtoQuantidade"',
        'COUNT(compras.id) OVER () AS "totalVendas"',
        'SUM(produtos.preco * compras_produtos.quantidade) OVER () AS "totalReceita"',
      ])
      .leftJoin(
        'compras_produtos',
        'compras_produtos',
        'compras.id = compras_produtos."compraId"',
      )
      .leftJoin(
        'produtos',
        'produtos',
        'compras_produtos."produtoId" = produtos.id',
      )
      .groupBy(
        'compras.id, compras."createdAt", produtos.id, produtos.nome, produtos.preco, compras_produtos.quantidade, produtos.preco',
      )
      .getRawMany();

    return relatorios.map((relatorio) => ({
      message: 'Relatório recuperado com sucesso',
      compras: [
        {
          produtos: [
            {
              produtoId: relatorio.produtoId,
              quantidade: relatorio.produtoQuantidade,
            },
          ],
          status: 'Pago',
        },
      ],
      totalVendas: Number(relatorio.totalVendas),
      totalReceita: Number(relatorio.totalReceita),
    }));
  }
}
