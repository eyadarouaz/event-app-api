import { PostService } from 'src/modules/post/post.service';
import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Like } from "src/entities/like.entity";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";


@Injectable()
export class LikeService {
    constructor(
        @InjectRepository(Like) private likesRepository: Repository<Like>,
        private readonly postService: PostService) {}


    async likePost(user: User, postId: number) {
        //Get post
        const post = await this.postService.getPostById(postId);
        if(post) {
            //Check if post is already liked by user
            const isLiked = await this.getLike(user.id, postId);
            if(!isLiked){
                const like = await this.likesRepository.create({user: user, post: post});
                return this.likesRepository.save(like);
            }throw new ConflictException('Post already liked');
        }
        throw new NotFoundException ('Failed to like');
    }

    async dislikePost(user: User, postId: number) {
        const likeExist = await this.getLike(user.id, postId);
        if(likeExist){
            return await this.likesRepository.delete({user: user, post: {id:postId}});
        }
        throw new NotFoundException ('Cannot dislike');
    }

    async getLikesByPost(postId: number) {
        const post = await this.postService.getPostById(postId);
        if(!post) {
            throw new NotFoundException(`Post with id ${postId} does not exist`);
        }
        //Return likes + number of likes
        return this.likesRepository.findAndCount({
            where: {
                post: {id: postId}
            }
        });
    }
        
    async getLike(userId: number, postId:number) {
        return await this.likesRepository.findOne({
            relations:{user:true, post:true}, 
            where: {
                user: {id: userId}, post: {id: postId}
            }
        });
    }

}
