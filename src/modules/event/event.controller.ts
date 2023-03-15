import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import { CreateEventDto } from './dto/create-event.dto';
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, Request } from '@nestjs/common';
import { EventService } from './event.service';
import { ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/shared/guards/admin.guard';

@ApiTags('event')
@UseGuards(JwtAuthGuard)
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @UseGuards(AdminGuard)
  @Post()
  async createEvent(@Body() eventDto: CreateEventDto) {
    return this.eventService.createEvent(eventDto);
  }

  @UseGuards(AdminGuard)
  @Put(':id')
  async updateEvent(@Param('id') id, @Body() eventDto: UpdateEventDto) {
    return this.eventService.updateEvent(eventDto, id);
  }
  
  @UseGuards(AdminGuard)
  @Delete(':id')
  async deleteEvent(@Param('id') id: number) {
    return this.eventService.deleteEvent(id);
  }

  @Get('date')
  async getByDate(@Body('date') date: Date) {
    return this.eventService.getEventByDate(date);
  }

  @Post('register/:eventId')
  async eventRegister(@Param('eventId') id, @Request() req) {
    return this.eventService.eventRegister(id, req.user.id);
  }

  @Get('registrations/:id')
  async getRegistrationsByEvent(@Param('id') id) {
    return this.eventService.getRegistrationsByEvent(id);
  }


}
