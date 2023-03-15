import { RolesGuard } from './../auth/roles.guard';
import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { Event } from 'src/entities/event.entity';
import { Registration } from 'src/entities/event-registration.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Registration])],
  controllers: [EventController],
  providers: [EventService, JwtAuthGuard, RolesGuard]
})
export class EventModule {}
