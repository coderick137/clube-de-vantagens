import { CreateProdutoDto } from '../dto/create-produto.dto';
import { Produto } from '../entities/produto.entity';
import { CategoriaEnum } from '../enums/categoria.enum';

export interface IProductRepository {
  createProduct(dto: CreateProdutoDto, categoria: CategoriaEnum): Promise<Produto>;
  findAllProducts(
    page: number,
    limit: number,
    filters?: Record<string, any>,
  ): Promise<{ data: Produto[]; total: number }>;
  findById(id: number): Promise<Produto | undefined>;
}
