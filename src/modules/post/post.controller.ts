import { AuthGuard } from '@nestjs/passport';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { Controller, Post, Request } from "@nestjs/common";
import { Body, Delete, Get, Param, Put, UseGuards, UseInterceptors } from "@nestjs/common/decorators";
import { PostService } from "./post.service";
import { UserService } from 'src/modules/user/user.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('post')
@UseGuards(AuthGuard())
@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService,
        private readonly userService: UserService) {}

    @Get('all')
    async getPosts() {
        return this.postService.getAllPosts();
    }

    @Post()
    async createPost(@Request() req, @Body() createDto: CreatePostDto) {
        const user = await this.userService.getUserById(req.user.id);
        console.log(user);
        return this.postService.createPost(user, createDto);
    }

    @Put(':id')
    async updatePost(@Request() req, @Param('id') id: number, @Body() updateDto: UpdatePostDto ) {
       return this.postService.updatePost(req.user, id, updateDto);
    }
    
    @Delete(':id')
    async deletePost(@Request() req, @Param('id') id: number) {
        return this.postService.deletePost(req.user, id);
    }

}