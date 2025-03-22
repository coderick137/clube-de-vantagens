import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  Min,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProdutoDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome do produto é obrigatório' })
  @MaxLength(100, {
    message: 'O nome do produto deve ter no máximo 100 caracteres',
  })
  @ApiProperty({
    example: 'Produto 1',
    description:
      'O nome do produto. Deve ser uma string não vazia com no máximo 100 caracteres.',
  })
  nome: string;

  @IsString()
  @IsNotEmpty({ message: 'A descrição do produto é obrigatória' })
  @MaxLength(255, {
    message: 'A descrição do produto deve ter no máximo 255 caracteres',
  })
  @ApiProperty({
    example: 'Descrição detalhada do produto 1',
    description:
      'Uma descrição detalhada do produto. Deve ser uma string não vazia com no máximo 255 caracteres.',
  })
  descricao: string;

  @IsString()
  @IsNotEmpty({ message: 'A categoria do produto é obrigatória' })
  @MaxLength(100, {
    message: 'A categoria do produto deve ter no máximo 50 caracteres',
  })
  @ApiProperty({
    example: 'Eletrônicos',
    description:
      'A categoria do produto. Deve ser uma string não vazia com no máximo 50 caracteres.',
  })
  categoria: string;

  @IsNumber({}, { message: 'O preço do produto deve ser um número válido' })
  @Type(() => Number)
  @Min(0.01, { message: 'O preço do produto deve ser maior que 0' })
  @ApiProperty({
    example: 100.0,
    description: 'O preço do produto. Deve ser um número maior que 0.',
  })
  preco: number;
}
