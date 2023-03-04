import { UpdatePostDto } from './dto/update-post.dto';
import { User } from 'src/entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable, NotFoundException} from "@nestjs/common";
import { Repository } from 'typeorm';
import { Post } from 'src/entities/post.entity';

@Injectable()
export class PostService {
    constructor( @InjectRepository(Post) private postsRepository: Repository<Post>) {}

    //CRUD
    async createPost( user: User, postDto: CreatePostDto) {
        try {
            const post = await this.postsRepository.create({...postDto, author: user });
            await this.postsRepository.save(post);
            return post;
        }catch(err) {
            throw new HttpException("Post was not created", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    async updatePost(user:User, id: number, updateDto: UpdatePostDto) {
        try {
            const toUpdate = await this.postsRepository.findOne({relations: {author: true}, where: {author: {id: user.id}, id:id}});
            const updated = Object.assign(toUpdate, updateDto);
            return await this.postsRepository.save(updated); 
        }catch(err) {
            throw new HttpException("Post was not updated", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async deletePost(id: number) {
        try {
            return await this.postsRepository.delete({id: id});
        }catch(err) {
            throw new HttpException("Post was not deleted", HttpStatus.INTERNAL_SERVER_ERROR);
        }
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

    async getPostByAuthor(user: User){
        try {
            return this.postsRepository.find({relations: {author: true}, where: {author: {id: user.id}}});
        } catch (err) {
            throw new NotFoundException('No posts found');
        }
    }

    
}

