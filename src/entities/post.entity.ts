import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn} from 'typeorm';
import { Comment } from './comment.entity';
import { Like } from './like.entity';
import { User } from './user.entity';

@Entity({name: 'posts'})
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  body: string;

  @CreateDateColumn ({name: 'created_at', type: 'timestamp'})
  createdAt: Date;

  @UpdateDateColumn ({name: 'updated_at', type: 'timestamp'})
  updatedAt: Date;

  //Relations
  //Many posts has One user
  @ManyToOne(() => User, (user: User) => user.posts)
  @JoinColumn({ name: 'user_id' })
  user: User

  //One post has Many likes
  @OneToMany(
  type => Like,
  (like: Like) => like.post,
  { onUpdate: 'CASCADE', onDelete: 'CASCADE' },
  )
  likes: Like[];

  @OneToMany(
    type => Comment, (comment: Comment) => comment.post,
    { onUpdate: 'CASCADE', onDelete: 'CASCADE' }
  )
  comments: Comment[];

}