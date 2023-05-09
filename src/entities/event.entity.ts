import { Transform } from "class-transformer";
import { BeforeInsert, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Registration } from "./event-registration.entity";
import { EventStatus } from "src/shared/enums/event-status";

@Entity('events')
export class Event {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column({nullable: true})
    image: string;

    @Column()
    startDate: Date;

    @Column()
    endDate: Date;

    @Column()
    location: string;
    
    @Column({
        type: "enum",
        enum: EventStatus,
        default: EventStatus.SCHEDULED,
      })
    status: string;

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