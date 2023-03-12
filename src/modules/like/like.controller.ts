import { LikeService } from './like.service';
import { Controller, Post, UseGuards, Request, Param, Delete, UseInterceptors, Get } from "@nestjs/common";
import { JwtAuthGuard } from "src/modules/auth/jwt-auth.guard";
import { UserService } from "src/modules/user/user.service";
import { ResponseInterceptor } from 'src/shared/interceptors/response.interceptor';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('like')
@UseGuards(JwtAuthGuard)
@Controller()
export class LikeController {

    constructor(private readonly userService: UserService,
        private readonly likeService: LikeService) {}
    
    
    @Get('likes/:id')
    async getLikesByPost(@Param('id') id) {
        return this.likeService.getLikesByPost(id);
    }

    @Post('like/:id')
    async likePost(@Request() req, @Param('id') postId: number) {
        const user = await this.userService.getUserById(req.user.id);
        console.log(user);
        return this.likeService.likePost(user, postId);
    }

    @Delete('dislike/:id')
    async dislikePost(@Request() req, @Param('id') postId: number) {
        return this.likeService.dislikePost(req.user, postId);
    }       
    
}        