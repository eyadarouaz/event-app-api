import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { AuthGuard } from '@nestjs/passport';
import { Controller, Get, Post, Body, Request, Put, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService,) {}

  @Post('forgot')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
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
  
}
