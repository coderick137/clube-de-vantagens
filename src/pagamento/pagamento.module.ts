import { Module } from '@nestjs/common';
import { PagamentoController } from './controller/pagamento.controller';
import { PagamentoService } from './service/pagamento.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pagamento } from './entities/pagamento.entity';
import { PagamentoRepository } from './repository/pagamento.repository';
import { CompraRepository } from '../compras/repositories/compra.repository';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Compra } from '../compras/entities/compra.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Pagamento,
      PagamentoRepository,
      CompraRepository,
      Compra,
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [PagamentoController],
  providers: [PagamentoService, PagamentoRepository, CompraRepository],
  exports: [PagamentoService],
})
export class PagamentoModule {}
