import { Message } from './../../entities/message.entity';
import { User } from './../../entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message) private messagesRepository: Repository<Message>,
    private authService: AuthService,
  ) {}

  async getUserFromSocket(socket: Socket) {
    const token = socket.handshake.headers.authorization;
    const payload = await this.authService.verifyToken(token);
    return await payload.user;
  }

  async createMessage(content: string, user: User): Promise<Message> {
    const message = await this.messagesRepository.create({ content, user });
    await this.messagesRepository.save(message);
    return message;
  }

  async getMessages(): Promise<Message[]> {
    return await this.messagesRepository.find({
      relations: ['user'],
    });
  }
}
