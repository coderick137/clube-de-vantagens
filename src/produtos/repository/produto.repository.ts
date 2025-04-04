import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Produto } from '../entities/produto.entity';
import { IProductRepository } from '../interfaces/IProductRepository';
import { CreateProdutoDto } from '../dto/create-produto.dto';
import { CategoriaEnum } from '../enums/categoria.enum';

@Injectable()
export class ProdutoRepository
  extends Repository<Produto>
  implements IProductRepository
{
  constructor(private readonly dataSource: DataSource) {
    super(Produto, dataSource.createEntityManager());
  }
  async createProduct(
    dto: CreateProdutoDto,
    categoria: CategoriaEnum,
  ): Promise<Produto> {
    const produto = this.create({
      ...dto,
      categoria,
    });

    return await this.save(produto);
  }

  async findAllProducts(
    page: number,
    limit: number,
    filters?: Record<string, any>,
  ): Promise<{ data: Produto[]; total: number }> {
    const validPage = Number(page) || 1;
    const validLimit = Number(limit) || 10;

    if (filters?.categoria) {
      const categoria = filters.categoria
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
      const [data, total] = await this.createQueryBuilder('p')
        .where('LOWER(unaccent(p.categoria)) = :categoria', { categoria })
        .take(validLimit)
        .skip((validPage - 1) * validLimit)
        .getManyAndCount();
      return { data, total };
    }

    const [data, total] = await this.findAndCount({
      where: filters,
      take: validLimit,
      skip: (validPage - 1) * validLimit,
    });
    return { data, total };
  }

  async findById(id: number): Promise<Produto> {
    const produto = await this.findOne({ where: { id } });
    if (!produto) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado.`);
    }
    return produto;
  }

  async findAllWithPagination(
    page: number,
    limit: number,
    categoria?: CategoriaEnum,
  ): Promise<{ data: Produto[]; total: number }> {
    const queryBuilder = this.createQueryBuilder('produto');

    if (categoria) {
      queryBuilder.where('produto.categoria = :categoria', { categoria });
    }

    const [data, total] = await queryBuilder
      .take(limit)
      .skip((page - 1) * limit)
      .getManyAndCount();

    return { data, total };
  }
}
