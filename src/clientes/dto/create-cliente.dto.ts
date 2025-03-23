import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
  MaxLength,
} from 'class-validator';
import { TipoCliente } from '../entities/cliente.entity';

export class CreateClienteDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome do cliente é obrigatório' })
  @MaxLength(50, { message: 'O nome deve ter no máximo 50 caracteres' })
  @ApiProperty({ example: 'José da Silva', description: 'Nome do cliente' })
  nome: string;

  @IsEmail({}, { message: 'O email deve ser válido' })
  @IsNotEmpty({ message: 'O email do cliente é obrigatório' })
  @ApiProperty({
    example: 'exemplo@email.com',
    description: 'Email do cliente',
  })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'A senha do cliente é obrigatória' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  @MaxLength(20, { message: 'A senha deve ter no máximo 20 caracteres' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/, {
    message: 'A senha deve conter pelo menos uma letra e um número',
  })
  @ApiProperty({
    example: 'senhadocliente1',
    description: 'Senha do cliente',
  })
  senha: string;

}
