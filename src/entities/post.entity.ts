import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Comment } from './comment.entity';
import { Event } from './event.entity';
import { Like } from './like.entity';
import { Survey } from './survey.entity';
import { User } from './user.entity';

@Entity({ name: 'posts' })
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  //Relations

  @OneToOne(() => Event)
  @JoinColumn({ name: 'event_post' })
  eventPost: Event;

  @OneToOne(() => Survey)
  @JoinColumn({ name: 'survey_post' })
  surveyPost: Survey;

  @ManyToOne(() => User, (user: User) => user.posts)
  @JoinColumn({ name: 'user_id' })
  user: User;

  //One post has Many likes
  @OneToMany(() => Like, (like: Like) => like.post, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  likes: Like[];

  @OneToMany(() => Comment, (comment: Comment) => comment.post, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  comments: Comment[];
}
