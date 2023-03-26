import { DateRangeDto } from './dto/date-range.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { CreateEventDto } from './dto/create-event.dto';
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, Request } from '@nestjs/common';
import { EventService } from './event.service';
import { ApiTags } from '@nestjs/swagger';
import { strategies } from 'src/shared/constants';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('event')
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @UseGuards(AuthGuard(strategies.admin))
  @Post()
  async createEvent(@Body() eventDto: CreateEventDto) {
    return this.eventService.createEvent(eventDto);
  }

  @UseGuards(AuthGuard(strategies.admin))
  @Put(':id')
  async updateEvent(@Param('id') id, @Body() eventDto: UpdateEventDto) {
    return this.eventService.updateEvent(eventDto, id);
  }
  
  @UseGuards(AuthGuard(strategies.admin))
  @Delete(':id')
  async deleteEvent(@Param('id') id: number) {
    return this.eventService.deleteEvent(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('date')
  async getByDate(@Body() dateRangeDto: DateRangeDto) {
    return this.eventService.getEventByDate(dateRangeDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('register/:eventId')
  async eventRegister(@Param('eventId') id, @Request() req) {
    return this.eventService.eventRegister(id, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('registrations/:id')
  async getRegistrationsByEvent(@Param('id') id) {
    return this.eventService.getRegistrationsByEvent(id);
  }


}
