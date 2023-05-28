import {
  Body,
  Controller,
  Delete,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('forgot')
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Put('reset-password')
  async resetPassword(@Query() query, @Body('password') password: string) {
    return this.authService.resetPassword(
      query.token,
      query.verifCode,
      password,
    );
  }

  @Post('login')
  login(@Body(new ValidationPipe()) loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('verify-token')
  verifyToken(@Body('token') token: string) {
    return this.authService.verifyToken(token);
  }

  @Post('refresh')
  refreshToken(@Body('token') token: string) {
    return this.authService.createAccessTokenFromRefreshToken(token);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('logout')
  removeRefreshToken(@Request() req) {
    return this.authService.removeRefreshToken(req.user.username);
  }
}
