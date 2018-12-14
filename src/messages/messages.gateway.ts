import {
    WebSocketGateway,
    SubscribeMessage,
    WsResponse,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
  } from '@nestjs/websockets';
import { Observable } from 'rxjs';
import { UsersService } from 'users/users.service';
import { User } from 'users/user.entity';
import { MessageService } from './message.service';

@WebSocketGateway(9995)
  export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server;

    connectedUsers: string[] = [];

    constructor(
      private usersService: UsersService,
      private messagesService: MessageService,
    ) {}

    async handleConnection(socket) {
        const user: User​​ = await this.usersService.findUser( socket.handshake.query.username);
        this.connectedUsers = [...this.connectedUsers, String(user.id)];
        // Send list of connected users
        this.server.emit('users', this.connectedUsers);

    }

    async handleDisconnect(socket) {
      const user: User = await this.usersService.findUser( socket.handshake.query.username );
      const userPos = this.connectedUsers.indexOf(String(user.id));

      if (userPos > -1) {
        this.connectedUsers = [
          ...this.connectedUsers.slice(0, userPos),
          ...this.connectedUsers.slice(userPos + 1),
        ];
        // Sends the new list of connected users
        this.server.emit('users', this.connectedUsers);
      }
    }

    @SubscribeMessage('message')
    async onMessage(client, data: any) {
        const event: string = 'message';
        const result = data;

        await this.messagesService.createMessage(result);
        const messages = await this.messagesService.getMessages(data.groupName, data.threadName);
        client.broadcast.to(data.threadName + '/' + data.groupName).emit(event, messages);

        return Observable.create(observer =>
          observer.next({ event, data: messages }),
      );
    }

    @SubscribeMessage('join')
    async onRoomJoin(client, data: any): Promise<any> {
      client.join(data);
      const event: string = 'message';
      const threadName: string = data.split('/')[0];
      const groupName: string = data.split('/')[1];
      const messages = await this.messagesService.getMessages(groupName, threadName);
      // Send last messages to the connected user
      client.emit(event, messages);

      return Observable.create(observer =>
        observer.next({ event, data: messages }),
    );
    }

    @SubscribeMessage('leave')
    onRoomLeave(client, data: any): void {
      client.leave(data);
    }
}
