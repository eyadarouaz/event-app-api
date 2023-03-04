import { UserModule } from './../user/user.module';
import { UserService } from 'src/user/user.service';
import { JwtStrategy } from './../auth/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Post } from 'src/entities/post.entity';
import { PassportModule } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Post]),
  PassportModule.register({
    defaultStrategy :'jwt',
  }),
  UserModule],
  controllers: [PostController],
  providers: [PostService, JwtStrategy, RolesGuard]
})
export class PostModule {}
