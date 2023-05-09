import { PassportModule } from '@nestjs/passport';
import { PostModule } from './../post/post.module';
import { UserModule } from './../user/user.module';
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Comment } from "src/entities/comment.entity";
import { CommentController } from "./comment.controller";
import { CommentService } from "./comment.service";
import { User } from 'src/entities/user.entity';
import { Post } from 'src/entities/post.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Post, Comment]),
    UserModule,
    PassportModule.register({defaultStrategy: 'jwt'}),
    PostModule],
    controllers: [CommentController],
    providers: [CommentService]
}
)
export class CommentModule {}