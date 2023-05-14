import {
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/entities/post.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postsRepository: Repository<Post>,
  ) {}

  //Getters
  async getAllPosts() {
    return await this.postsRepository.find({
      relations: { eventPost: true, user: true, surveyPost: { options: true } },
    });
  }

  async getPostById(id: number) {
    try {
      return await this.postsRepository.findOne({
        where: { id: id },
      });
    } catch {
      throw new NotFoundException('No posts found');
    }
  }

  async getPostByUser(user: User) {
    try {
      return this.postsRepository.find({
        relations: { user: true },
        where: {
          user: { id: user.id },
        },
      });
    } catch (err) {
      throw new NotFoundException('No posts found');
    }
  }
}
