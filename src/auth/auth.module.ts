import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ClientesModule } from '../clientes/clientes.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import jwtConfig from '../config/jwt.config';
import { AuthGuard } from './guard/auth.guard';

const config = jwtConfig();
@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: config.jwtSecret,
      signOptions: { expiresIn: '1d' },
    }),
    ClientesModule,
    ConfigModule,
  ],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
