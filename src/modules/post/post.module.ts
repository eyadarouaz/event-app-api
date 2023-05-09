import { JwtStrategy } from 'src/modules/auth/jwt.strategy';
import { UserModule } from './../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Post } from 'src/entities/post.entity';
import { PassportModule } from '@nestjs/passport';


@Module({
  imports: [TypeOrmModule.forFeature([Post]),
  PassportModule.register({
    defaultStrategy :'jwt',
  }),
  UserModule],
  controllers: [PostController],
  providers: [PostService, JwtStrategy],
  exports: [PostService]
})
export class PostModule {}
