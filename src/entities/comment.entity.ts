import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Post } from "./post.entity";
import { User } from "./user.entity";

@Entity({name: 'comments'})
export class Comment {
    
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  body: string;

  @CreateDateColumn ({name: 'created_at', type: 'timestamp'})
  createdAt: Date;

  @UpdateDateColumn ({name: 'updated_at', type: 'timestamp'})
  updatedAt: Date;

 //Relationships
  @ManyToOne(
    () => User,
    (user: User) => user.comments,
    { onUpdate: 'CASCADE', onDelete: 'CASCADE' },
    )
  user: User;

  @ManyToOne(
    () => Post,
    (post: Post) => post.comments,
    { onUpdate: 'CASCADE', onDelete: 'CASCADE' },
  )
//   @JoinColumn({ name: 'post_id' })
  post: Post;

}