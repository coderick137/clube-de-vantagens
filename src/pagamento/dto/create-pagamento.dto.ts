import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreatePagamentoDto {
  @IsNumber()
  @IsNotEmpty()
  compraId: number;
}
