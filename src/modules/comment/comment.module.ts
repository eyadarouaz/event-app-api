import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import { PostModule } from './../post/post.module';
import { UserModule } from './../user/user.module';
import { PostService } from './../post/post.service';
import { UserService } from 'src/modules/user/user.service';
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
    PostModule],
    controllers: [CommentController],
    providers: [CommentService, JwtAuthGuard]
}
)
export class CommentModule {}