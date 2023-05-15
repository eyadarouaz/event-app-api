import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from 'src/modules/user/user.service';
import { LikeService } from './like.service';

@ApiTags('like')
@UseGuards(AuthGuard())
@Controller()
export class LikeController {
  constructor(
    private readonly userService: UserService,
    private readonly likeService: LikeService,
  ) {}

  @Get(':id/likes')
  async getLikesByPost(@Param('id', ParseIntPipe) id: number) {
    return this.likeService.getLikesByPost(id);
  }

  @Get(':id/getLike')
  async getLike(@Param('id') id, @Request() req) {
    return this.likeService.getLike(req.user.id, id);
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
