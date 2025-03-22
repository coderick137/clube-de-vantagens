import { Module } from '@nestjs/common';
import { ProdutosController } from './controller/produtos.controller';
import { ProdutosService } from './service/produtos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Produto } from './entities/produto.entity';
import { ProdutoRepository } from './repository/produto.repository';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Produto]),
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
  controllers: [ProdutosController],
  providers: [ProdutosService, ProdutoRepository],
  exports: [ProdutosService, ProdutoRepository],
})
export class ProdutosModule {}
