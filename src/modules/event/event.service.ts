import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Registration } from 'src/entities/event-registration.entity';
import { Event } from 'src/entities/event.entity';
import { Post } from 'src/entities/post.entity';
import { User } from 'src/entities/user.entity';
import { EventStatus } from 'src/shared/enums/event-status';
import { Between, Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { DateRangeDto } from './dto/date-range.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event) private eventsRepository: Repository<Event>,
    @InjectRepository(Registration)
    private registrationsRepository: Repository<Registration>,
    @InjectRepository(Post) private postsRepository: Repository<Post>,
  ) {}

  async createEvent(eventDto: CreateEventDto, user: User) {
    try {
      const event = this.eventsRepository.create({ ...eventDto });
      await this.eventsRepository.save(event);
      const eventPost = this.postsRepository.create({
        eventPost: event,
        user: user,
      });
      await this.postsRepository.save(eventPost);
      return event;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateEvent(eventDto: UpdateEventDto, id: number) {
    try {
      return await this.eventsRepository.update({ id: id }, { ...eventDto });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteEvent(id: number) {
    try {
      return this.eventsRepository.delete({ id: id });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async upload(id: number, fileName: string) {
    try {
      return await this.eventsRepository.update(
        { id: id },
        { image: fileName },
      );
    } catch (err) {
      throw new HttpException(
        'Cannot update photo',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async eventRegister(eventId: number, userId: number) {
    const event = await this.getEventById(eventId);
    if (event) {
      const isRegistered = await this.getRegistration(userId, eventId);
      if (!isRegistered) {
        const reg = await this.registrationsRepository.create({
          user: { id: userId },
          event: { id: eventId },
        });
        return this.registrationsRepository.save(reg);
      }
      throw new ConflictException('User already registered');
    }
  }

  async updateStatus() {
    const events = await this.eventsRepository.find();
    const today = new Date();
    events.forEach((element: Event) => {
      if (element.startDate < today) {
        return this.eventsRepository.update(
          { id: element.id },
          { status: EventStatus.COMPLETED },
        );
      } else if (element.startDate == today) {
        return this.eventsRepository.update(
          { id: element.id },
          { status: EventStatus.HAPPENING },
        );
      }
    });
  }

  //Getters
  async getEvents() {
    const [list, count] = await this.eventsRepository.findAndCount();
    return { list, count };
  }

  async getEventById(id: number) {
    return this.eventsRepository.findOneBy({ id: id });
  }

  async getEventByDate(dateRangeDto: DateRangeDto) {
    return this.eventsRepository.find({
      where: {
        startDate: Between(dateRangeDto.fromDate, dateRangeDto.toDate),
      },
    });
  }

  async getRegistrationsByEvent(eventId) {
    const event = await this.getEventById(eventId);
    if (!event) {
      throw new NotFoundException(`Event with id ${eventId} does not exist`);
    }
    const [list, count] = await this.registrationsRepository.findAndCount({
      relations: { event: true, user: true },
      where: {
        event: { id: eventId },
      },
    });
    return { list, count };
  }

  async getRegistration(userId, eventId) {
    return this.registrationsRepository.findOne({
      relations: { user: true, event: true },
      where: {
        user: { id: userId },
        event: { id: eventId },
      },
    });
  }
}
