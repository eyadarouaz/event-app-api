import { Role } from 'src/shared/role.enum';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, ManyToOne, OneToMany} from 'typeorm';
import { Post } from './post.entity';

@Entity('users')
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;
  
  @Column()
  password: string;

  @Column({default: null})
  firstName: string;

  @Column({default: null})
  lastName: string;

  @Column({default: null})
  birthday: Date;

  @Column({default: null})
  mobile: number;

  @Column({default: false})
  isActive: boolean;

  @Column({
    type: "enum",
    enum: Role,
    default: Role.USER,
  })
  role: Role[];

  @Column ({type: 'timestamp', default:() => "CURRENT_TIMESTAMP"})
  createdAt: Date;

  @Column ({type: 'timestamp', default:() => "CURRENT_TIMESTAMP"})
  updatedAt: Date;

  //Relations
  
  @OneToMany(() => Post, (post: Post) => post.author)
  posts: Post[];
  
}