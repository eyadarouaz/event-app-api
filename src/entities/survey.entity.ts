import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SurveyOption } from './survey-option.entity';

@Entity('surveys')
export class Survey {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  question: string;

  @Column({ name: 'due_date' })
  dueDate: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => SurveyOption, (option: SurveyOption) => option.survey, {
    onDelete: 'CASCADE',
  })
  options: SurveyOption[];
}
