import { Module } from '@nestjs/common';
import { ClientesController } from './controller/clientes.controller';
import { ClientesService } from './service/clientes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from './entities/cliente.entity';
import { ClienteRepository } from './repository/cliente.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cliente]),
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
  controllers: [ClientesController],
  providers: [ClientesService, ClienteRepository],
  exports: [ClientesService, ClienteRepository],
})
export class ClientesModule {}
