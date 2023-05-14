import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Post } from './post.entity';
import { User } from './user.entity';

@Entity('likes')
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user: User) => user.likes, {
    /*onUpdate: 'CASCADE',*/ onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Post, (post: Post) => post.likes, {
    /*onUpdate: 'CASCADE',*/ onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id' })
  post: Post;
}
