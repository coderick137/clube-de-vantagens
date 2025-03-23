import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, Matches } from 'class-validator';

export class CreateRelatorioDto {
  @IsOptional()
  @Matches(/^\d{2}\/\d{2}\/\d{4}$/, {
    message: 'dataInicio deve estar no formato DD/MM/YYYY',
  })
  @ApiProperty({
    example: '01/03/2025',
    description:
      'Data de início do período para o relatório no formato brasileiro (DD/MM/YYYY).',
  })
  dataInicio?: string;

  @IsOptional()
  @Matches(/^\d{2}\/\d{2}\/\d{4}$/, {
    message: 'dataFim deve estar no formato DD/MM/YYYY',
  })
  @ApiProperty({
    example: '31/03/2025',
    description:
      'Data de término do período para o relatório no formato brasileiro (DD/MM/YYYY).',
  })
  dataFim?: string;
}
