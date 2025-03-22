import { Module } from '@nestjs/common';
import { ComprasController } from './controller/compras.controller';
import { ComprasService } from './service/compras.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Compra } from './entities/compra.entity';
import { CompraProduto } from './entities/compra-produto.entity';
import { CompraRepository } from './repositories/compra.repository';
import { CompraProdutoRepository } from './repositories/compra-produto.repository';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Compra, CompraProduto]),
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
  providers: [ComprasService, CompraRepository, CompraProdutoRepository],
  controllers: [ComprasController],
  exports: [ComprasService],
})
export class ComprasModule {}
