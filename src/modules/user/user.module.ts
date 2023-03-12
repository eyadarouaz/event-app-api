import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import { UserController } from './user.controller';
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from 'src/entities/user.entity';
import { UserService } from "./user.service";
import { JwtStrategy } from 'src/modules/auth/jwt.strategy';



@Module({
    imports: [
      TypeOrmModule.forFeature([User]),
    ],
    controllers: [UserController],
    providers: [UserService, JwtAuthGuard, JwtStrategy],
    exports: [UserService]
})
export class UserModule {}