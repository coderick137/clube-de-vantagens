import { Module } from '@nestjs/common';
import { RelatoriosController } from './controller/relatorios.controller';
import { RelatoriosService } from './service/relatorios.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Compra } from '../compras/entities/compra.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RelatorioVendasRepository } from './repository/relatorio-vendas.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Compra, RelatorioVendasRepository]),
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
  controllers: [RelatoriosController],
  providers: [RelatoriosService, RelatorioVendasRepository],
  exports: [RelatoriosService, RelatorioVendasRepository],
})
export class RelatoriosModule {}
