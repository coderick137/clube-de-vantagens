import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateProdutoDto } from '../dto/create-produto.dto';
import { ProdutoRepository } from '../repository/produto.repository';
import { Produto } from '../entities/produto.entity';

export enum CategoriaEnum {
  ELETRONICOS = 'Eletrônicos',
  ELETRODOMESTICOS = 'Eletrodomesticos',
  MOVEIS = 'Moveis',
  BRINQUEDOS = 'Brinquedos',
}

@Injectable()
export class ProdutosService {
  private readonly logger = new Logger(ProdutosService.name);

  constructor(private readonly produtoRepository: ProdutoRepository) {}

  async create(createProdutoDto: CreateProdutoDto): Promise<Produto> {
    this.logger.log(
      `Iniciando criação do produto: ${JSON.stringify(createProdutoDto)}`,
    );
    try {
      const produto =
        await this.produtoRepository.createProduct(createProdutoDto);
      this.logger.log(`Produto criado com sucesso: ${JSON.stringify(produto)}`);
      return produto;
    } catch (error) {
      this.logger.error(`Erro ao criar produto: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(
    page: number,
    limit: number,
    categoria?: CategoriaEnum,
  ): Promise<{ data: Produto[]; total: number }> {
    this.logger.log(
      `Buscando produtos - Página: ${page}, Limite: ${limit}, Categoria: ${categoria}`,
    );
    try {
      const validPage = Number(page) || 1;
      const validLimit = Number(limit) || 10;

      const filters: Record<string, any> = {};
      if (categoria) {
        filters.categoria = categoria
      }

      console.log('==========================>',filters);

      let result: { data: Produto[]; total: number };

      if (filters.categoria) {
        const categoria = filters.categoria;
        const [data, total] = await this.produtoRepository
          .createQueryBuilder('p')
          .where('p.categoria = :categoria', { categoria })
          .take(validLimit)
          .skip((validPage - 1) * validLimit)
          .getManyAndCount();
        result = { data, total };
      } else {
        const [data, total] = await this.produtoRepository.findAndCount({
          where: filters,
          take: validLimit,
          skip: (validPage - 1) * validLimit,
        });
        result = { data, total };
      }

      this.logger.log(
        `Produtos encontrados: ${result.data.length}, Total: ${result.total}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Erro ao buscar produtos: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findOne(id: string): Promise<Produto> {
    this.logger.log(`Buscando produto com ID: ${id}`);
    try {
      const produto = await this.produtoRepository.findById(+id);
      if (!produto) {
        this.logger.warn(`Produto com ID ${id} não encontrado`);
        throw new NotFoundException(`Produto com ID ${id} não encontrado`);
      }
      this.logger.log(`Produto encontrado: ${JSON.stringify(produto)}`);
      return produto;
    } catch (error) {
      this.logger.error(
        `Erro ao buscar produto com ID ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
