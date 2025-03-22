import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateCompraProdutoDto {
  @IsNotEmpty({ message: 'O campo produtoId não pode estar vazio.' })
  @IsNumber({}, { message: 'O campo produtoId deve ser um número.' })
  @Min(1, { message: 'O campo produtoId deve ser um número positivo.' })
  @ApiProperty({ example: 1 })
  produtoId: number;

  @IsNotEmpty({ message: 'O campo quantidade não pode estar vazio.' })
  @IsNumber({}, { message: 'O campo quantidade deve ser um número válido.' })
  @Min(1, { message: 'A quantidade deve ser pelo menos 1.' })
  @ApiProperty({ example: 3 })
  quantidade: number;
}
