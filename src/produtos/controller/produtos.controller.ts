import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProdutosService } from '../service/produtos.service';
import { CreateProdutoDto } from '../dto/create-produto.dto';
import { UpdateProdutoDto } from '../dto/update-produto.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Produto } from '../entities/produto.entity';
import { Public } from '../../shared/decorators/public.decorator';

@Controller('produtos')
export class ProdutosController {
  constructor(private readonly produtosService: ProdutosService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Criar um novo produto' })
  @ApiResponse({
    status: 201,
    description: 'Produto criado com sucesso.',
    type: CreateProdutoDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  async create(@Body() createProdutoDto: CreateProdutoDto): Promise<Produto> {
    return this.produtosService.create(createProdutoDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar todos os produtos com paginação e filtros' })
  @ApiResponse({
    status: 200,
    description: 'Lista de produtos retornada com sucesso.',
    type: [CreateProdutoDto],
  })
  async findAll(
    @Param('page') page: number,
    @Param('limit') limit: number,
    @Body() filters?: Record<string, any>,
  ): Promise<{ data: Produto[]; total: number }> {
    return await this.produtosService.findAll(page, limit, filters);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Obter um produto pelo ID' })
  @ApiResponse({
    status: 200,
    description: 'Produto retornado com sucesso.',
    type: CreateProdutoDto,
  })
  @ApiResponse({ status: 404, description: 'Produto não encontrado.' })
  async findOne(@Param('id') id: string): Promise<Produto> {
    return this.produtosService.findOne(id);
  }
}
