import { AdminStrategy } from './admin.strategy';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstant } from 'src/shared/constants';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: jwtConstant.secret,
      signOptions: {
        algorithm: 'HS512',
      },
    }),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    UserModule,
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AdminStrategy],
  exports: [PassportModule, AuthService],
})
export class AuthModule {}
