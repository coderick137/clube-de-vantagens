import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { CategoriaEnum, ProdutosService } from '../service/produtos.service';
import { CreateProdutoDto } from '../dto/create-produto.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { Produto } from '../entities/produto.entity';
import { AuthGuard } from '../../auth/guard/auth.guard';

@Controller('produtos')
export class ProdutosController {
  private readonly logger = new Logger(ProdutosController.name);

  constructor(private readonly produtosService: ProdutosService) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Criar um novo produto' })
  @ApiResponse({
    status: 201,
    description: 'Produto criado com sucesso.',
    type: CreateProdutoDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({
    status: 401,
    description: 'Token inválido ou não autorizado.',
  })
  async create(@Body() createProdutoDto: CreateProdutoDto): Promise<Produto> {
    try {
      return this.produtosService.create(createProdutoDto);
    } catch (error) {
      this.logger.error('Erro ao criar produto', error.stack);
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException(
          'Token inválido ou assinatura incorreta.',
        );
      }
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'Listar todos os produtos com paginação e filtros' })
  @ApiResponse({
    status: 200,
    description: 'Lista de produtos retornada com sucesso.',
    type: [CreateProdutoDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido ou não autorizado.',
  })
  @ApiQuery({
    name: 'categoria',
    enum: CategoriaEnum,
    required: false,
  })
  async findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('categoria') categoria?: CategoriaEnum,
  ): Promise<{ data: Produto[]; total: number }> {
    try {
      return await this.produtosService.findAll(page, limit, categoria);
    } catch (error) {
      this.logger.error('Erro ao listar produtos', error.stack);
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException(
          'Token inválido ou assinatura incorreta.',
        );
      }
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  @ApiOperation({ summary: 'Obter um produto pelo ID' })
  @ApiResponse({
    status: 200,
    description: 'Produto retornado com sucesso.',
    type: CreateProdutoDto,
  })
  @ApiResponse({ status: 404, description: 'Produto não encontrado.' })
  @ApiResponse({
    status: 401,
    description: 'Token inválido ou não autorizado.',
  })
  async findOne(@Param('id') id: string): Promise<Produto> {
    try {
      return this.produtosService.findOne(id);
    } catch (error) {
      this.logger.error('Erro ao buscar produto', error.stack);
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException(
          'Token inválido ou assinatura incorreta.',
        );
      }
      throw error;
    }
  }
}
