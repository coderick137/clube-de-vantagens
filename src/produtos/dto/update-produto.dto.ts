import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProdutoDto } from './create-produto.dto';
import {
  IsOptional,
  IsString,
  IsNumber,
  Min,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProdutoDto extends PartialType(CreateProdutoDto) {
  @IsString()
  @IsOptional()
  @MaxLength(100, {
    message: 'O nome do produto deve ter no máximo 100 caracteres',
  })
  @ApiProperty({
    example: 'Produto 1',
    description:
      'O nome do produto. Deve ser uma string com no máximo 100 caracteres.',
    required: false,
  })
  nome?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255, {
    message: 'A descrição do produto deve ter no máximo 255 caracteres',
  })
  @ApiProperty({
    example: 'Descrição detalhada do produto 1',
    description:
      'Uma descrição detalhada do produto. Deve ser uma string com no máximo 255 caracteres.',
    required: false,
  })
  descricao?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100, {
    message: 'A categoria do produto deve ter no máximo 50 caracteres',
  })
  @ApiProperty({
    example: 'Eletrônicos',
    description:
      'A categoria do produto. Deve ser uma string com no máximo 50 caracteres.',
    required: false,
  })
  categoria?: string;

  @IsNumber({}, { message: 'O preço do produto deve ser um número válido' })
  @IsOptional()
  @Type(() => Number)
  @Min(0.01, { message: 'O preço do produto deve ser maior que 0' })
  @ApiProperty({
    example: 100.0,
    description: 'O preço do produto. Deve ser um número maior que 0.',
    required: false,
  })
  preco?: number;
}
