import { CreateEventDto } from './dto/create-event.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from 'src/entities/event.entity';
import { Repository } from 'typeorm';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventService {
    constructor (@InjectRepository(Event) private eventsRepository: Repository<Event>){}

    async createEvent(eventDto: CreateEventDto){
        try{
            const event = this.eventsRepository.create({...eventDto});
            await this.eventsRepository.save(event);
            return event;  
        }catch {
            throw new HttpException("Event was not created", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateEvent(eventDto: UpdateEventDto, id: number){
        try{
            return await this.eventsRepository.update({id:id}, {...eventDto});
        }catch {
            throw new HttpException("Event was not created", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteEvent(id: number) {
        try{
            return this.eventsRepository.delete({id: id});
         }catch {
             throw new HttpException("Event was not created", HttpStatus.INTERNAL_SERVER_ERROR);
         }
    }


    //Getters
    async getEvents() {
        return this.eventsRepository.find();
    }

    async getEventById(id: number) {
        return this.eventsRepository.findOneBy({id:id});
    }

    async getEventByDate(date: Date) {
        return this.eventsRepository.findBy({date:date});
    }

}
