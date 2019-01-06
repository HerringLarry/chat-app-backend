import {
    WebSocketGateway,
    SubscribeMessage,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
  } from '@nestjs/websockets';
import { Observable } from 'rxjs';
import { UsersService } from 'users/users.service';
import { User } from 'users/user.entity';
import { DirectMessageService } from './direct-message.service';
import { MessageService } from 'messages/message.service';

@WebSocketGateway(9999)
  export class DirectMessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server;

    connectedUsers: string[] = [];

    constructor(
      private usersService: UsersService,
      private directMessagesService: DirectMessageService​​,
    ) {}

    async handleConnection(socket) {
        const user: User = await this.usersService.findUser( socket.handshake.query.username);
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
        await this.directMessagesService.createMessage(result);
        const messages = await this.directMessagesService.getMessages(data.groupName, data.threadId);
        client.broadcast.to( data.threadId + '/' + data.groupName ).emit(event, messages);
        return Observable.create(observer =>
          observer.next({ event, data: messages }),
      );
    }

    @SubscribeMessage('join')
    async onRoomJoin(client, data: any): Promise<any> {
      client.join(data);
      const event: string = 'message';
      const threadId: number = Number(data.split('/')[0]);
      const groupName: string = String(data.split('/')[1]);
      const messages = await this.directMessagesService.getMessages(groupName, threadId);
      // Send last messages to the connected user

      client.emit(event, messages);

      return Observable.create(observer =>
        observer.next({ event, data: messages }),
    );
    }

    @SubscribeMessage('leave')
    async onRoomLeave(client, data: any) {
      client.leave(data);
    }

}
