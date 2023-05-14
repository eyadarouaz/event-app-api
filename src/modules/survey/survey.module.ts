import { PassportModule } from '@nestjs/passport';
import { UserModule } from './../user/user.module';
import { SurveyController } from './survey.controller';
import { SurveyService } from './survey.service';
import { SurveyOption } from './../../entities/survey-option.entity';
import { SurveyResponse } from './../../entities/survey-response.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Survey } from 'src/entities/survey.entity';
import { JwtStrategy } from '../auth/jwt.strategy';
import { Post } from 'src/entities/post.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Survey, SurveyResponse, SurveyOption, Post]),
    UserModule,
    PassportModule,
  ],
  controllers: [SurveyController],
  providers: [SurveyService, JwtStrategy],
})
export class SurveyModule {}
