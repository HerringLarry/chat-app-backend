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
import { NotificationsService } from 'notifications/notifications.service';

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
    async onMessage(client, data: any) { // Add Notifications to non-listed users
        const event: string = 'message';
        const result = data;
        await this.messagesService.createMessage(result);
        const responseObject: ResponseObject = await this.getResponseObject( data.groupId, data.threadId);
        client.broadcast.to(data.threadId + '/' + data.groupId).emit(event, responseObject);

        return Observable.create(observer =>
          observer.next({ event, data: responseObject }),
      );
    }

    @SubscribeMessage('join')
    async onRoomJoin(client, data: any): Promise<any> { // Reset notifications and reset client username on frontend
      client.join(data);
      const event: string = 'message';
      const threadId: number = data.split('/')[0];
      const groupId: number = data.split('/')[1];
      const user: User = await this.usersService.getUser( client.handshake.query.username );
      const responseObject: ResponseObject = await this.getResponseObject( groupId, threadId );
      await this.messagesService.addUserIdToMessages( user, responseObject.messages );
      // Send last messages to the connected user
      client.emit(event, responseObject);

      return Observable.create(observer =>
        observer.next({ event, data: responseObject }),
    );
    }

    @SubscribeMessage('leave')
    async onRoomLeave(client, data: any) {
      const threadId: number = data.split('/')[0];
      const groupId: number = data.split('/')[1];
      const user: User = await this.usersService.getUser( client.handshake.query.username );
      client.leave(data);
    }

    async getResponseObject( groupId: number, threadId: number ): Promise<ResponseObject> {
      const group: Group = await this.groupService.getGroupById( groupId );
      const messages = await this.messagesService.getMessages(group.name, threadId);
      const members: Member[] = await this.memberService.getAllMembersInGroup( group );
      const users: User[] = await this.usersService.getUsersByMembership( members );
      const responseObject: ResponseObject = new ResponseObject( messages, users );

      return responseObject;
    }
}
