import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Event } from "./event.entity";

@Entity('registrations')
export class Registration {

    @PrimaryGeneratedColumn()
    id: number;

    //Relations
    @ManyToOne(
        () => User,
        (user: User) => user.registrations,
        { /*onUpdate: 'CASCADE',*/ onDelete: 'CASCADE' },
        )
    @JoinColumn({ name: 'user_id' })
    user: User;


    @ManyToOne(
        () => Event,
        (event: Event) => event.registrations,
        { /*onUpdate: 'CASCADE',*/ onDelete: 'CASCADE' },
        )
    @JoinColumn({ name: 'event_id' })
    event: Event;


}