import { UpdatePostDto } from './dto/update-post.dto';
import { User } from 'src/entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ForbiddenException, HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException} from "@nestjs/common";
import { Repository } from 'typeorm';
import { Post } from 'src/entities/post.entity';

@Injectable()
export class PostService {
    constructor( @InjectRepository(Post) private postsRepository: Repository<Post>) {}

    
    async createPost( user: User, postDto: CreatePostDto) {
        try {
            const post = await this.postsRepository.create({...postDto, user: user });
            await this.postsRepository.save(post);
            return post;
        }catch(err) {
            throw new HttpException("Cannot create post", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updatePost(user:User, id: number, updateDto: UpdatePostDto) {
        const toUpdate = await this.postsRepository.findOne({relations: {user: true}, where: {user: user, id:id}});
        if(toUpdate) {
            return await this.postsRepository.update({id:id, user:user}, {...updateDto});
        }
        throw new ForbiddenException("Cannot update post");
    }

    async deletePost(user: User, id: number) {
        const toDelete = await this.postsRepository.findOne({relations: {user: true}, where: {user: user, id:id}});
        if (toDelete){
            return await this.postsRepository.delete(id);
        }
        throw new ForbiddenException("Cannot delete post");
    }

    //Getters
    async getAllPosts() {
        return await this.postsRepository.find();
    }

    async getPostById(id: number) {
        try {
            return await this.postsRepository.findOne({where: {id: id}});
        }catch {
            throw new NotFoundException('No posts found');
        }
    }

    async getPostByUser(user: User){
        try {
            return this.postsRepository.find({relations: {user: true}, where: {user: {id: user.id}}});
        } catch (err) {
            throw new NotFoundException('No posts found');
        }
    }

    
}

