import { CreateCommentDto } from './dto/create-comment.dto';
import { UserService } from 'src/modules/user/user.service';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Request, UseGuards, UseInterceptors, ValidationPipe } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('comment')
@UseGuards(AuthGuard())
@Controller('comment')
export class CommentController {
    constructor(private readonly commentService: CommentService,
        private readonly userService: UserService) {}

    
    @Get(':id')
    async getCommentsByPost(@Param('id', ParseIntPipe) id: number) {
        return this.commentService.getCommentsByPost(id);
    }

    @Post(':id')
    async addComment(@Request() req, @Param('id', ParseIntPipe) postId: number,
                     @Body(new ValidationPipe()) commentDto: CreateCommentDto){
        const user = await this.userService.getUserById(req.user.id);
        return this.commentService.addComment(user, postId, commentDto);
    }

    @Delete(':id')
    async deleteComment(@Request() req, @Param('id', ParseIntPipe) commentId: number){
        return this.commentService.deleteComment(req.user.id, commentId);
    }


}