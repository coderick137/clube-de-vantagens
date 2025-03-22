import { CreateProdutoDto } from '../dto/create-produto.dto';
import { Produto } from '../entities/produto.entity';

export interface IProductRepository {
  createProduct(dto: CreateProdutoDto): Promise<Produto>;
  findAllProducts(
    page: number,
    limit: number,
    filters?: Record<string, any>,
  ): Promise<{ data: Produto[]; total: number }>;
  findById(id: number): Promise<Produto | undefined>;
}
