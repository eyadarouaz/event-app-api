import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { Controller, Post, Request } from "@nestjs/common";
import { Body, Get, Param, Put, UseGuards } from "@nestjs/common/decorators";
import { PostService } from "./post.service";
import { UserService } from 'src/user/user.service';

@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService,
        private readonly userService: UserService) {}

    @UseGuards(JwtAuthGuard)
    @Get('all')
    async getPosts() {
        return this.postService.getAllPosts();
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async createPost(@Request() req, @Body() createDto: CreatePostDto) {
        const user = await this.userService.getUserById(req.sub);
        return this.postService.createPost(user, createDto);
    }

    @UseGuards(JwtAuthGuard)
    @Put('update/:id')
    async updatePost(@Request() req, @Param('id') id: number, @Body() updateDto: UpdatePostDto ) {
        return this.postService.updatePost(req.user, id, updateDto);
    }

}