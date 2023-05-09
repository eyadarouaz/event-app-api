import { PostService } from 'src/modules/post/post.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Comment } from "src/entities/comment.entity";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class CommentService {
    constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    private readonly postService: PostService) {}

    async addComment(user: User, postId: number, commentDto: CreateCommentDto) {
        const post = await this.postService.getPostById(postId);
        if (post){
            const comment = await this.commentsRepository.create({
                ...commentDto, user: user, post: post
            });
            return this.commentsRepository.save(comment);
        }
        throw new NotFoundException('Post does not exist');
    }

    async deleteComment(userId: number, commentId: number ) {
        const toDelete = await this.commentsRepository.findOne({
            relations: {user: true}, 
            where: {
                user: {id:userId}, id:commentId
            }
        });
        if(toDelete) {
            return await this.commentsRepository.delete(toDelete);
        }
        throw new HttpException('Failed to delete comment', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    //Getters
    async getCommentsByPost(postId: number) {
        const post = await this.postService.getPostById(postId);
        if(!post) {
            throw new NotFoundException(`Post with id ${postId} does not exist`);
        }
        //Return comments + number of comments
        return await this.commentsRepository.findAndCount({
            relations: {post: true}, 
            where: {
                post: {id: postId}
            }
        });
    }

    async getCommentByUser(userId: number) {
        return await this.commentsRepository.find({
            relations: {user: true}, 
            where: {
                user: {id: userId}
            }
        });
    }

    async getCommentById(id: number) {
        return this.commentsRepository.findOneBy({id:id});
    }
}