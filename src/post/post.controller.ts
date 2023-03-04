import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { Controller, Post, Request } from "@nestjs/common";
import { Body, Param, Put, UseGuards } from "@nestjs/common/decorators";
import { PostService } from "./post.service";

@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async createPost(@Request() req, @Body() createDto: CreatePostDto) {
        return this.postService.createPost(req.user, createDto);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async updatePost(@Request() req, @Param('id') id: number, @Body() updateDto: UpdatePostDto ) {
        return this.postService.updatePost(req.user, id, updateDto);
    }

}