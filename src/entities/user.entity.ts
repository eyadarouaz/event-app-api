import { Status } from './../shared/enums/status.enum';
import { Role } from 'src/shared/enums/role.enum';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, ManyToOne, OneToMany, UpdateDateColumn, CreateDateColumn} from 'typeorm';
import { Like } from './like.entity';
import { Post } from './post.entity';
import { Comment } from './comment.entity';
import { Exclude } from '@nestjs/class-transformer';
import { Registration } from './event-registration.entity';

@Entity({name: 'users'})
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;
  
  @Column()
  @Exclude({toPlainOnly: true})
  password: string;

  @Column({name: 'first_name', nullable: true})
  firstName: string;

  @Column({name: 'last_name', nullable: true})
  lastName: string;

  @Column({nullable: true})
  birthday: Date;

  @Column({nullable: true})
  mobile: number;

  @Column({
    type: "enum",
    enum: Status,
    default: Status.OFFLINE,
  })
  status: boolean;

  @Column({
    type: "enum",
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @Column({name:'profile_image', nullable: true})
  profileImage: string;

  @Column({name: 'reset_token', nullable: true})
  resetToken: string;

  @CreateDateColumn ({name: 'created_at', type: 'timestamp'})
  createdAt: Date;

  @UpdateDateColumn ({name: 'updated_at', type: 'timestamp'})
  updatedAt: Date;
 
  //Relations
  
  @OneToMany(() => Post, (post: Post) => post.user)
  posts: Post[];

  @OneToMany(
    () => Like,
    (like: Like) => like.user,
    { onUpdate: 'CASCADE', onDelete: 'CASCADE' },
  )
  likes: Like[];

  @OneToMany(
    type => Comment, (comment: Comment) => comment.user,
    { onUpdate: 'CASCADE', onDelete: 'CASCADE' }
  )
  comments: Comment[];

  @OneToMany(
    () => Registration,
    (registration: Registration) => registration.user,
    { onDelete: 'CASCADE' },
  )
  registrations: Like[];
  
}