import { AuthGuard } from '@nestjs/passport';
import { LikeService } from './like.service';
import { Controller, Post, UseGuards, Request, Param, Delete, UseInterceptors, Get, ParseIntPipe } from "@nestjs/common";
import { UserService } from "src/modules/user/user.service";
import { ResponseInterceptor } from 'src/shared/interceptors/response.interceptor';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('like')
@UseGuards(AuthGuard())
@Controller()
export class LikeController {

    constructor(private readonly userService: UserService,
        private readonly likeService: LikeService) {}
    
    
    @Get(':id/likes')
    async getLikesByPost(@Param('id', ParseIntPipe) id: number) {
        return this.likeService.getLikesByPost(id);
    }

    @Post(':id/like')
    async likePost(@Request() req, @Param('id', ParseIntPipe) postId: number) {
        const user = await this.userService.getUserById(req.user.id);
        console.log(user);
        return this.likeService.likePost(user, postId);
    }

    @Delete(':id/dislike')
    async dislikePost(@Request() req, @Param('id', ParseIntPipe) postId: number) {
        return this.likeService.dislikePost(req.user, postId);
    }       
    
}        