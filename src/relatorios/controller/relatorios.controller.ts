import { Controller, Post, Query, UseGuards } from '@nestjs/common';
import { RelatoriosService } from '../service/relatorios.service';
import { CreateRelatorioDto } from '../dto/create-relatorio.dto';
import { RelatorioVendaResponseDto } from '../dto/relatorio-venda-response';
import { AuthGuard } from '../../auth/guard/auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('relatorios')
@Controller('relatorios')
export class RelatoriosController {
  constructor(private readonly relatoriosService: RelatoriosService) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('vendas')
  @ApiOperation({ summary: 'Gerar relatório de vendas' })
  @ApiResponse({
    status: 200,
    description: 'Relatório gerado com sucesso.',
    type: RelatorioVendaResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  async gerarRelatorio(
    @Query() filtro: CreateRelatorioDto,
  ): Promise<RelatorioVendaResponseDto> {
    return this.relatoriosService.gerarRelatorioVenda(filtro);
  }
}
