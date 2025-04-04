import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import { CreateClienteDto } from '../dto/create-cliente.dto';
import { ClientesService } from '../service/clientes.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../../auth/guard/auth.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { TipoCliente } from '../entities/cliente.entity';

@ApiTags('clientes')
@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Criar um novo cliente' })
  @ApiResponse({ status: 201, description: 'Cliente criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiQuery({
    name: 'tipo',
    enum: TipoCliente,
    description: 'Tipo do cliente',
    required: true,
  })
  create(
    @Body() createClienteDto: CreateClienteDto,
    @Query('tipo') tipo: string,
  ) {
    const tipoCliente = tipo as TipoCliente;
    return this.clientesService.createClient(createClienteDto, tipoCliente);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar todos os usuários' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários.',
    type: [CreateClienteDto],
  })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 403, description: 'Acesso negado.' })
  async findAll() {
    return await this.clientesService.findAll();
  }
}
