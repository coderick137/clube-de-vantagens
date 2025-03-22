import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateProdutoDto } from '../dto/create-produto.dto';
import { UpdateProdutoDto } from '../dto/update-produto.dto';
import { ProdutoRepository } from '../repository/produto.repository';
import { Produto } from '../entities/produto.entity';

@Injectable()
export class ProdutosService {
  private readonly logger = new Logger(ProdutosService.name);

  constructor(private readonly produtoRepository: ProdutoRepository) {}

  create(createProdutoDto: CreateProdutoDto): Promise<Produto> {
    this.logger.log(`Criando produto: ${createProdutoDto.nome}`);

    try {
      return this.produtoRepository.createProduct(createProdutoDto);
    } catch (error) {
      this.logger.error(`Erro ao criar produto: ${error.message}`);
      throw error;
    } finally {
      this.logger.log(`Produto criado com sucesso: ${createProdutoDto.nome}`);
    }
  }

  async findAll(
    page: number,
    limit: number,
    filters?: Record<string, any>,
  ): Promise<{ data: Produto[]; total: number }> {
    this.logger.log('Buscando todos os produtos com paginação e filtros');
    try {
      return await this.produtoRepository.findAllProducts(page, limit, filters);
    } catch (error) {
      this.logger.error(`Erro ao buscar produtos: ${error.message}`);
      throw error;
    }
  }

  async findOne(id: string): Promise<Produto> {
    this.logger.log(`Buscando produto com ID ${id}`);
    try {
      const produto = await this.produtoRepository.findById(+id);
      if (!produto) {
        this.logger.warn(`Produto com ID ${id} não encontrado`);
        throw new NotFoundException(`Produto com ID ${id} não encontrado`);
      }
      return produto;
    } catch (error) {
      this.logger.error(`Erro ao buscar produto: ${error.message}`);
      throw error;
    }
  }
}
