import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CreateClienteDto } from '../dto/create-cliente.dto';
import { UpdateClienteDto } from '../dto/update-cliente.dto';
import { ClientesService } from '../service/clientes.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '../../shared/decorators/public.decorator';
import { AuthGuard } from '../../auth/guard/auth.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { RolesGuard } from '../../shared/guards/roles.guard';

@ApiTags('clientes')
@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Criar um novo cliente' })
  @ApiResponse({ status: 201, description: 'Cliente criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  create(@Body() createClienteDto: CreateClienteDto) {
    return this.clientesService.createClient(createClienteDto);
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
