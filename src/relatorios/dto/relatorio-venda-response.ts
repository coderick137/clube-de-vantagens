import { IsNumber, IsString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class ProdutoResponse {
  @ApiProperty({ description: 'ID do produto' })
  produtoId: number;

  @ApiProperty({ description: 'Quantidade do produto' })
  quantidade: number;
}

class CompraResponse {
  @ApiProperty({
    description: 'Lista de produtos da compra',
    type: [ProdutoResponse],
  })
  produtos: ProdutoResponse[];

  @ApiProperty({ description: 'Status da compra' })
  status: string;
}

export class RelatorioVendaResponseDto {
  @ApiProperty({ description: 'Mensagem de retorno' })
  @IsString()
  message: string;

  @ApiProperty({
    description: 'Lista de compras realizadas',
    type: [CompraResponse],
  })
  @IsArray()
  compras: CompraResponse[];

  @ApiProperty({ description: 'Total de vendas realizadas' })
  @IsNumber()
  totalVendas: number;

  @ApiProperty({ description: 'Total de receita gerada' })
  @IsNumber()
  totalReceita: number;
}
