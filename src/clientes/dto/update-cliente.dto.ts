import { PartialType } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MinLength,
  Matches,
  MaxLength,
} from 'class-validator';
import { CreateClienteDto } from './create-cliente.dto';

export class UpdateClienteDto extends PartialType(CreateClienteDto) {
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'O nome deve ter no máximo 50 caracteres' })
  nome?: string;

  @IsOptional()
  @IsEmail({}, { message: 'O email deve ser válido' })
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  @MaxLength(20, { message: 'A senha deve ter no máximo 20 caracteres' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/, {
    message: 'A senha deve conter pelo menos uma letra e um número',
  })
  senha?: string;

  @IsOptional()
  @IsIn(['admin', 'cliente'], { message: 'Tipo de cliente inválido' })
  tipo?: 'admin' | 'cliente';
}
