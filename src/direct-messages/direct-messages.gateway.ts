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
import { Group } from 'groups/group.entity';
import { Member } from 'members/member.entity';
import { MemberService } from 'members/member.service';
import { GroupService } from 'groups/group.service';
import { ResponseObject } from './helpers/helpers';

@WebSocketGateway(9999)
  export class DirectMessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server;

    connectedUsers: string[] = [];

    constructor(
      private usersService: UsersService,
      private directMessagesService: DirectMessageService​​,
      private memberService: MemberService,
      private groupService: GroupService,
    ) {}

    async handleConnection(socket) {
        const user: User = await this.usersService.getUser( socket.handshake.query.username);
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
        await this.directMessagesService.createMessage(result);
        const responseObject: ResponseObject = await this.getResponseObject( data.groupId, data.threadId );

        client.broadcast.to( data.threadId + '/' + data.groupId ).emit(event, responseObject);
        return Observable.create(observer =>
          observer.next({ event, data: responseObject }),
      );
    }

    @SubscribeMessage('join')
    async onRoomJoin(client, data: any): Promise<any> {
      const event: string = 'message';
      const threadId: number = Number(data.split('/')[0]);
      const groupId: number = Number(data.split('/')[1]);
      client.join(threadId + '/' + groupId);
      const userId: number = data.split('/')[2];
      const user: User = await this.usersService.getUserById( userId );
      // Send last messages to the connected user
      const responseObject: ResponseObject = await this.getResponseObject( groupId, threadId );
      await this.directMessagesService.addUserIdToMessages( user, responseObject.directMessages );
      client.emit(event, responseObject);

      return Observable.create(observer =>
        observer.next({ event, data: responseObject }),
    );
    }

    @SubscribeMessage('leave')
    async onRoomLeave(client, data: any) {
      client.leave(data);
    }

    async getResponseObject( groupId: number, threadId: number ): Promise<ResponseObject> {
      const messages = await this.directMessagesService.getMessagesById(groupId, threadId);
      const group: Group = await this.groupService.getGroupById( groupId );
      const members: Member[] = await this.memberService.getAllMembersInGroup( group );
      const users: User[] = await this.usersService.getUsersByMembership( members );
      const responseObject: ResponseObject = new ResponseObject( users, messages );

      return responseObject;
    }

}
