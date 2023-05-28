import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { Status } from 'src/shared/enums/status.enum';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { Message } from './../../entities/message.entity';
import { User } from './../../entities/user.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message) private messagesRepository: Repository<Message>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    private authService: AuthService,
  ) {}

  async getUserFromSocket(socket: Socket) {
    const token = await socket.handshake.query.token;
    const payload = await this.authService.verifyToken(token);
    return payload.user;
  }

  async getAllActive() {
    return await this.usersRepository.find({
      where: { status: Status.ONLINE },
    });
  }

  async createMessage(content: string, user: User): Promise<Message> {
    const message = await this.messagesRepository.create({ content, user });
    await this.messagesRepository.save(message);
    return message;
  }

  async connectUser(id: number) {
    return this.usersRepository.update({ id: id }, { status: Status.ONLINE });
  }

  async disconnectUser(id: number) {
    return this.usersRepository.update({ id: id }, { status: Status.OFFLINE });
  }

  async getMessages(): Promise<Message[]> {
    return await this.messagesRepository.find({
      relations: ['user'],
    });
  }
}
