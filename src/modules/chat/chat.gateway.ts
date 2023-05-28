import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: true,
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private chatService: ChatService) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() content: string,
  ): Promise<void> {
    const user = await this.chatService.getUserFromSocket(socket);
    const message = await this.chatService.createMessage(content, user);
    this.server.emit('recMessage', message);
  }

  @SubscribeMessage('activeUsers')
  async connectedUsers() {
    const activeUsers = await this.chatService.getAllActive();
    this.server.emit(
      'connectedUsers',
      activeUsers.map((x) => x.username),
    );
  }

  afterInit() {
    console.log('this is afterInit');
  }

  async handleDisconnect(socket: Socket) {
    try {
      const user = await this.chatService.getUserFromSocket(socket);
      this.chatService.disconnectUser(user.id);
      console.log('Disconnected: ' + user.username);
    } catch {
      console.log('jwt error');
    }
  }

  async handleConnection(socket: Socket) {
    try {
      const user = await this.chatService.getUserFromSocket(socket);
      this.chatService.connectUser(user.id);
      console.log('Connected: ' + user.username);
    } catch {
      console.log('jwt error');
    }
  }
}
