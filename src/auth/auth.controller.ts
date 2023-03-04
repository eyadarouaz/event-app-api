import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put, Request } from '@nestjs/common';
import { Roles } from 'src/shared/role.decorator';
import { Role } from 'src/shared/role.enum';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-user.dto';
import { RegisterDto } from './dto/register-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService,) {}

  // @Roles(Role.ADMIN)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('register')
  register (@Body() registerDto : RegisterDto ){
    return this.authService.registerUser(registerDto);
  }

  @Post('login')
  login (@Body() loginDto: LoginDto ) {
    return this.authService.validateUser(loginDto.usernameOrEmail, loginDto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Put('pwd/:pass') 
  updatePassword(@Request() req , @Param('pass') password: string) {
    return this.authService.changePassword(req.user.id, password);
  }
  
}
