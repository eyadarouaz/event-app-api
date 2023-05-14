import {
  ParseIntPipe,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { DateRangeDto } from './dto/date-range.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { CreateEventDto } from './dto/create-event.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import { EventService } from './event.service';
import { ApiTags } from '@nestjs/swagger';
import { strategies } from 'src/shared/constants';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import * as random from 'random-string-generator';
import * as fs from 'node:fs';
import { diskStorage } from 'multer';
import { mkdir } from 'fs/promises';
import { join } from 'node:path';
import { Response } from 'express';

@ApiTags('event')
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @UseGuards(AuthGuard(strategies.admin))
  @Post()
  async createEvent(
    @Body(new ValidationPipe()) eventDto: CreateEventDto,
    @Request() req,
  ) {
    return this.eventService.createEvent(eventDto, req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getEvents() {
    return this.eventService.getEvents();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async getEventById(@Param('id', ParseIntPipe) id: number) {
    return this.eventService.getEventById(id);
  }

  @UseGuards(AuthGuard(strategies.admin))
  @Put(':id')
  async updateEvent(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) eventDto: UpdateEventDto,
  ) {
    return this.eventService.updateEvent(eventDto, id);
  }

  @UseGuards(AuthGuard(strategies.admin))
  @Delete(':id')
  async deleteEvent(@Param('id', ParseIntPipe) id: number) {
    return this.eventService.deleteEvent(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('date')
  async getByDate(@Body(new ValidationPipe()) dateRangeDto: DateRangeDto) {
    return this.eventService.getEventByDate(dateRangeDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/register')
  async eventRegister(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.eventService.eventRegister(id, req.user.id);
  }

  @UseGuards(AuthGuard(strategies.admin))
  @Put(':id/upload')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination(req, file, callback) {
          if (!fs.existsSync('src/uploads/event-media'))
            mkdir('src/uploads/event-media');
          callback(null, 'src/uploads/event-media');
        },
        filename(req, file, callback) {
          const name = random(15);
          callback(null, name + '.jpg');
        },
      }),
    }),
  )
  async upload(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.eventService.upload(id, file.filename);
  }

  @Get(':id/image')
  async getEventImage(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const event = await this.eventService.getEventById(id);
    if (event) {
      const eventImage = event.image;
      const filePath = join(
        process.cwd(),
        'src/uploads/event-media/' + eventImage,
      );
      res.set({ 'Content-Type': 'image/jpeg' });
      fs.readFile(filePath, function (err, content) {
        res.end(content);
      });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id/registrations')
  async getRegistrationsByEvent(@Param('id', ParseIntPipe) id: number) {
    return this.eventService.getRegistrationsByEvent(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id/update-status')
  async updateEventsStatus() {
    return this.eventService.updateStatus();
  }
}
