import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne} from 'typeorm';
import { User } from './user.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  body: string;

  @Column ({type: 'timestamp', default:() => "CURRENT_TIMESTAMP"})
  createdAt: Date;

  @Column ({type: 'timestamp', default:() => "CURRENT_TIMESTAMP"})
  updatedAt: Date;

  //Relations

  @ManyToOne(() => User, (author: User) => author.posts)
  author: User


}