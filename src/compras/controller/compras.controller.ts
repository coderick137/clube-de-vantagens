import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CreateCompraDto } from '../dto/create-compra.dto';
import { UpdateCompraDto } from '../dto/update-compra.dto';
import { ComprasService } from '../service/compras.service';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { AuthGuard } from '../../auth/guard/auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('compras')
@Controller('compras')
export class ComprasController {
  constructor(private readonly comprasService: ComprasService) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Realizar uma compra' })
  @ApiResponse({ status: 201, description: 'Compra realizada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  async create(
    @Body() createCompraDto: CreateCompraDto,
    @CurrentUser() user: any,
  ) {
    const clienteId = user.id;
    const compra = await this.comprasService.create(createCompraDto, clienteId);

    if (!compra) {
      throw new Error('Erro ao realizar a compra. Tente novamente.');
    }

    return {
      mensagem: 'Compra realizada com sucesso',
      compra: {
        id: compra.id,
        status: compra.status,
        cliente: { id: compra.cliente.id },
        produtos: compra.produtos.map((produto) => ({
          produtoId: produto.produto.id,
          quantidade: produto.quantidade,
        })),
      },
    };
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'Listar todas as compras do cliente logado' })
  @ApiResponse({
    status: 200,
    description: 'Lista de compras do cliente logado.',
    type: [CreateCompraDto],
  })
  findAll(@CurrentUser() user: any) {
    const clienteId = user.id;
    return this.comprasService.listClientPurchases(clienteId);
  }
}
