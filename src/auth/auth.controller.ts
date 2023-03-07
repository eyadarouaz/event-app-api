import { ResetPasswordDto } from './dto/update-password.dto';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-user.dto';
import { RegisterDto } from './dto/register-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Roles } from 'src/shared/role.decorator';
import { RolesGuard } from './roles.guard';
import { Role } from 'src/shared/role.enum';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService,) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('register')
  register (@Body() registerDto : RegisterDto ){
    return this.authService.registerUser(registerDto);
  }

  @Post('login')
  login (@Body() loginDto: LoginDto ) {
    return this.authService.validateUser(loginDto.usernameOrEmail, loginDto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Put('reset-pwd') 
  updatePassword(@Request() req , @Body() passwordDto: ResetPasswordDto) {
    return this.authService.changePassword(req.user.sub, passwordDto);
  }
  
}
