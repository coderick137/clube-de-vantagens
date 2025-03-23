import { IsNumber, IsString, IsArray } from 'class-validator';

class ProdutoResponse {
  produtoId: number;
  quantidade: number;
}

class CompraResponse {
  produtos: ProdutoResponse[];
  status: string;
}

export class RelatorioVendaResponseDto {
  @IsString()
  message: string;

  @IsArray()
  compras: CompraResponse[];

  @IsNumber()
  totalVendas: number;

  @IsNumber()
  totalReceita: number;
}
