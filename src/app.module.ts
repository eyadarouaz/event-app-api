import { SurveyModule } from './modules/survey/survey.module';
import { CommentModule } from './modules/comment/comment.module';
import { PostModule } from './modules/post/post.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { LikeModule } from './modules/like/like.module';
import { EventModule } from './modules/event/event.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { mailerConfig } from './config/mailer.config';
import { ormConfig } from './config/mysql.config';
import { ChatModule } from './modules/chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MailerModule.forRoot(mailerConfig),
    TypeOrmModule.forRoot(ormConfig),
    AuthModule,
    UserModule,
    PostModule,
    CommentModule,
    LikeModule,
    EventModule,
    SurveyModule,
    ChatModule,
  ],
  providers: [],
})
export class AppModule {}
