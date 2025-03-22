import {
  IsNotEmpty,
  IsNumber,
  IsArray,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCompraProdutoDto } from './create-compra-produto.dto';
import { CompraStatus } from '../entities/compra.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompraDto {
  @IsArray({ message: 'O campo produtos deve ser um array.' })
  @ValidateNested({ each: true })
  @Type(() => CreateCompraProdutoDto)
  @ApiProperty({ type: [CreateCompraProdutoDto] })
  produtos: CreateCompraProdutoDto[];

  @IsEnum(CompraStatus, { message: 'O campo status deve ser um valor válido.' })
  @IsNotEmpty({ message: 'O campo status é obrigatório.' })
  @ApiProperty({ enum: CompraStatus, example: 'Pendente' })
  status: CompraStatus;
}
