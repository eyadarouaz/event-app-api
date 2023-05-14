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
    console.log(message);
    this.server.emit('recMessage', message);
  }

  afterInit(server: Server) {
    console.log('this is afterInit');
  }

  async handleDisconnect(socket: Socket) {
    console.log('this is handleDisconnect');
    const user = await this.chatService.getUserFromSocket(socket);
    console.log(`Disconnected: ${user.username}`);
  }

  async handleConnection(socket: Socket, ...args: any[]) {
    console.log('this is handleConnection');
    const user = await this.chatService.getUserFromSocket(socket);
    console.log(`Connected ${user.username}`);
  }
}

// import {
//     MessageBody, OnGatewayConnection,
//     SubscribeMessage,
//     WebSocketGateway,
//     WebSocketServer,
//   } from '@nestjs/websockets';
//   import { Server, Socket } from 'socket.io';
//   import { ChatService } from './chat.service';
// import Message from 'src/entities/message.entity';

//   @WebSocketGateway({
//     cors: {
//       origin: 'http://localhost:4200',
//     },
//   })
//   export class ChatGateway implements OnGatewayConnection {

//     constructor(private readonly chatService: ChatService) {}

//     @WebSocketServer() server: Server;

//     async handleConnection(socket: Socket) {
//       console.log(`Connected ${socket.id}`);;
//     }

//     @SubscribeMessage('send_message')
//     listenForMessages(@MessageBody() data: string) {
//       this.server.sockets.emit('receive_message', data);
//     }
//   }
