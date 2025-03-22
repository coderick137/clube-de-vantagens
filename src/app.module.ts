import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientesModule } from './clientes/clientes.module';
import { AuthModule } from './auth/auth.module';
import { ProdutosModule } from './produtos/produtos.module';
import { ComprasModule } from './compras/compras.module';
import { PagamentoModule } from './pagamento/pagamento.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT', 5432),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        // Decidi deixar o sincronizar como true para facilitar o desenvolvimento, assim o TypeORM cria as tabelas automaticamente
        synchronize: configService.get<boolean>('TYPEORM_SYNC', true),
      }),
    }),
    ClientesModule,
    AuthModule,
    ProdutosModule,
    ComprasModule,
    PagamentoModule,
  ],
})
export class AppModule {}
