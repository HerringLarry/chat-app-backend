import { GroupService } from './../groups/group.service';
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
import { MemberService } from 'members/member.service';
import { Group } from 'groups/group.entity';
import { Member } from 'members/member.entity';
import { ResponseObject } from './helpers/helpers';

@WebSocketGateway(9995)
  export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server;

    connectedUsers: string[] = [];

    constructor(
      private usersService: UsersService,
      private messagesService: MessageService,
      private groupService: GroupService,
      private memberService: MemberService,
    ) {}

    async handleConnection(socket) {
        const user: User​​ = await this.usersService.getUser( socket.handshake.query.username);
        this.connectedUsers = [...this.connectedUsers, String(user.id)];
        // Send list of connected users
        this.server.emit('users', this.connectedUsers);

    }

    async handleDisconnect(socket) {
      const user: User = await this.usersService.getUser( socket.handshake.query.username );
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
        const responseObject: ResponseObject = await this.getResponseObject( data.groupName, data.threadId);
        client.broadcast.to(data.threadId + '/' + data.groupName).emit(event, responseObject);

        return Observable.create(observer =>
          observer.next({ event, data: responseObject }),
      );
    }

    @SubscribeMessage('join')
    async onRoomJoin(client, data: any): Promise<any> {
      client.join(data);
      const event: string = 'message';
      const threadId: number = data.split('/')[0];
      const groupName: string = data.split('/')[1];
      const responseObject: ResponseObject = await this.getResponseObject( groupName, threadId );
      // Send last messages to the connected user
      client.emit(event, responseObject);

      return Observable.create(observer =>
        observer.next({ event, data: responseObject }),
    );
    }

    @SubscribeMessage('leave')
    onRoomLeave(client, data: any): void {
      client.leave(data);
    }

    async getResponseObject( groupName: string, threadId: number ): Promise<ResponseObject> {
      const messages = await this.messagesService.getMessages(groupName, threadId);
      const group: Group = await this.groupService.getGroup( groupName );
      const members: Member[] = await this.memberService.getAllMembersInGroup( group );
      const users: User[] = await this.usersService.getUsersByMembership( members );
      const responseObject: ResponseObject = new ResponseObject( messages, users );

      return responseObject;
    }
}
