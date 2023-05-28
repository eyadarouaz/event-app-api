import { Controller, Get, Render, Res } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('/chat')
  @Render('index')
  Home() {
    return;
  }

  //  @UseGuards(AuthGuard('jwt'))
  @Get('/api/chat')
  async Chat(@Res() res) {
    const messages = await this.chatService.getMessages();
    res.json(messages);
  }

  @Get('/api/active')
  async activeUsers(@Res() res) {
    const active = await this.chatService.getAllActive();
    res.json(active);
  }
}
