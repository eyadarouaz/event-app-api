import { Transform } from "class-transformer";
import { BeforeInsert, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Registration } from "./event-registration.entity";

@Entity('events')
export class Event {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    date: Date;

    @Column()
    location: string;
    
    @CreateDateColumn ({name: 'created_at', type: 'timestamp'})
    createdAt: Date;

    @UpdateDateColumn ({name: 'updated_at', type: 'timestamp'})
    updatedAt: Date;

    //Relations
    @OneToMany(
        type => Registration,
        (registration: Registration) => registration.event,
        // {onDelete: 'CASCADE' },
        )
    registrations: Registration[];
    
}