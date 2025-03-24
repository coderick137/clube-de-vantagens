import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateCompraDto } from '../dto/create-compra.dto';
import { CompraRepository } from '../repositories/compra.repository';
import { CompraProdutoRepository } from '../repositories/compra-produto.repository';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ComprasService {
  private readonly logger = new Logger(ComprasService.name);

  constructor(
    private readonly comprasRepository: CompraRepository,
    private readonly compraProdutoRepository: CompraProdutoRepository,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async create(createCompraDto: CreateCompraDto, clienteId: number) {
    const timestamp = new Date().toISOString();
    this.logger.log(
      `[${timestamp}] [create] Iniciando criação de compra para clienteId: ${clienteId} com dados: ${JSON.stringify(createCompraDto)}`,
    );
    try {
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

      const result = await this.comprasRepository.findOne({
        where: { id: compra.id },
        relations: ['produtos', 'produtos.produto', 'cliente'],
      });

      this.logger.log(
        `[${timestamp}] [create] Compra criada com sucesso para clienteId: ${clienteId}, compraId: ${compra.id}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `[${timestamp}] [create] Erro ao criar compra para clienteId: ${clienteId}, detalhes: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async listClientPurchases(clienteId: number) {
    const timestamp = new Date().toISOString();
    this.logger.log(
      `[${timestamp}] [listClientPurchases] Listando compras para clienteId: ${clienteId}`,
    );
    try {
      const cacheKey = `compras-${clienteId}`;
      const cacheData = await this.cacheManager.get(cacheKey);

      if (cacheData) {
        this.logger.log(
          `[${timestamp}] [listClientPurchases] Compras listadas com sucesso para clienteId: ${clienteId} a partir do cache`,
        );
        return cacheData;
      }

      const compras =
        await this.comprasRepository.listClientPurchases(clienteId);

      this.logger.log(
        `[${timestamp}] [listClientPurchases] Compras listadas com sucesso para clienteId: ${clienteId}, total: ${compras.length}`,
      );

      const comprasFormatted = compras.map((compra) => ({
        id: compra.id,
        status: compra.status,
        clienteId: compra.cliente.id,
        produtos: compra.produtos.map((prod) => ({
          produtoId: prod.produto.id,
          quantidade: prod.quantidade,
        })),
      }));

      await this.cacheManager.set(cacheKey, comprasFormatted, 3600);
      return comprasFormatted;
    } catch (error) {
      this.logger.error(
        `[${timestamp}] [listClientPurchases] Erro ao listar compras para clienteId: ${clienteId}, detalhes: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
