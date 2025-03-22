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
import { CreatePagamentoDto } from '../dto/create-pagamento.dto';
import { PagamentoService } from '../service/pagamento.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../../auth/guard/auth.guard';

@ApiTags('pagamento')
@Controller('pagamentos')
export class PagamentoController {
  constructor(private readonly pagamentoService: PagamentoService) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post(':compraId')
  @ApiOperation({ summary: 'Realizar um pagamento de uma compra' })
  @ApiResponse({ status: 201, description: 'Pagamento realizado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  async realizarPagamento(@Param('compraId') compraId: number) {
    const pagamento = await this.pagamentoService.simulatePayment(compraId);
    return {
      message: 'Pagamento realizado com sucesso',
      compra: compraId,
      pagamento,
    };
  }
}
