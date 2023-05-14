import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { Event } from 'src/entities/event.entity';
import { Registration } from 'src/entities/event-registration.entity';
import { Post } from 'src/entities/post.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, Registration, Post]),
    PassportModule,
  ],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
