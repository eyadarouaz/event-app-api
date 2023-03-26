import { Controller, Get, Post, Body, Request, Put, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,) {}

  @Post('forgot')
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Put()
  async resetPassword(@Request() req, @Body('password') password: string) {
    const token = await req.params.token;
    return this.authService.resetPassword(token, token.id, password);
  }

  @Post('login')
  login (@Body() loginDto: LoginDto ) {
    return this.authService.login(loginDto);
  }

  @Post('verify-token')
  verifyToken(@Body('token') token) {
    return this.authService.verifyToken(token);
  }
  
}
