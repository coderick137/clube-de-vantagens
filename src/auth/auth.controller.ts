import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from '../shared/decorators/public.decorator';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Fazer login' })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso.' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto?.email, loginDto?.senha);
  }
}
