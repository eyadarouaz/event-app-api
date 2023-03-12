import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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
    
}