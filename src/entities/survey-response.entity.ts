import { User } from 'src/entities/user.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SurveyOption } from './survey-option.entity';

@Entity()
export class SurveyResponse {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => SurveyOption, (option: SurveyOption) => option.responses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'option_id' })
  option: SurveyOption;

  @ManyToOne(() => User, (user: User) => user.responses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
