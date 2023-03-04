import { RolesGuard } from './roles.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserModule } from './../user/user.module';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/shared/jwt.constant';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { 
        algorithm:'HS512',
        expiresIn: '1h', }
    }),
    PassportModule.register({
      defaultStrategy :'jwt',
    }),
    UserModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard, RolesGuard]
})
export class AuthModule {}
