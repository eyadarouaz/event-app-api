import { CreateEventDto } from './dto/create-event.dto';
import { HttpException, HttpStatus, Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from 'src/entities/event.entity';
import { Repository } from 'typeorm';
import { UpdateEventDto } from './dto/update-event.dto';
import { Registration } from 'src/entities/event-registration.entity';

@Injectable()
export class EventService {
    constructor (@InjectRepository(Event) private eventsRepository: Repository<Event>,
    @InjectRepository(Registration) private registrationsRepository: Repository<Registration>){}

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

    async eventRegister(eventId: number, userId: number) {
        const event = await this.getEventById(eventId);
        if (event) {
            const isRegistered = await this.getRegistration(userId, eventId);
            if(!isRegistered){
                const reg = await this.registrationsRepository.create({user:{id:userId}, event:{id:eventId}})
                return this.registrationsRepository.save(reg);
            }throw new ConflictException('User already registered');
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

    async getRegistrationsByEvent(eventId) {
        const event = await this.getEventById(eventId);
        if(!event) {
            throw new NotFoundException(`Event with id ${eventId} does not exist`);
        }
        return this.registrationsRepository.findAndCount({relations: {event: true, user:true}, where: {event: {id: eventId}}});
    }

    async getRegistration(userId, eventId) {
        return this.registrationsRepository.findOne({relations:{user:true, event:true}, where: {user: {id: userId}, event: {id: eventId}}});
    }
}
