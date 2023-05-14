import {
  Controller
} from '@nestjs/common';
import {
  Get,
  UseGuards
} from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from 'src/modules/user/user.service';
import { PostService } from './post.service';

@ApiTags('post')
@UseGuards(AuthGuard())
@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly userService: UserService,
  ) {}

  @Get()
  async getPosts() {
    return this.postService.getAllPosts();
  }
}
