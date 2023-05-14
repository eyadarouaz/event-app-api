import { PassportModule } from '@nestjs/passport';
import { UserModule } from './../user/user.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/modules/auth/jwt.strategy';
import { Like } from 'src/entities/like.entity';
import { LikeController } from './like.controller';
import { LikeService } from './like.service';
import { PostModule } from 'src/modules/post/post.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Like]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UserModule,
    PostModule,
  ],
  controllers: [LikeController],
  providers: [LikeService, JwtStrategy],
})
export class LikeModule {}
