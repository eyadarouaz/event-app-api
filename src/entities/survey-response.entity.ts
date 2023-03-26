import { User } from 'src/entities/user.entity';
import { SurveyOption } from './survey-option.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SurveyResponse {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => SurveyOption,
    (option: SurveyOption) => option.responses,
    { onDelete: 'CASCADE' },)
    @JoinColumn({ name: 'option_id' })
    option: SurveyOption;
    
    @OneToOne(() => User)
    @JoinColumn({name: 'user_id'})
    user: User;
}