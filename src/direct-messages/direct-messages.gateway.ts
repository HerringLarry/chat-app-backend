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
import { OnMessageResponse } from 'messages/helpers/helpers';
import { DirectMessage } from './direct-message.entity';

@WebSocketGateway(9999)
  export class DirectMessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server;

    static maxAmountOfMessages = 42;
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
        const msg = await this.directMessagesService.createMessage(result);
        const responseObject: OnMessageResponse = await this.getOnMessageResponseObject( data.groupId, data.threadId, msg );
        client.broadcast.to( data.threadId + '/' + data.groupId ).emit(event, responseObject);
        return Observable.create(observer =>
          observer.next({ event, data: responseObject }),
      );
    }

    @SubscribeMessage('join')
    async onRoomJoin(client, data: any): Promise<any> {
      const event: string = 'join';
      const threadId: number = Number(data.split('/')[0]);
      const groupId: number = Number(data.split('/')[1]);
      client.join(threadId + '/' + groupId);
      const userId: number = data.split('/')[2];
      const user: User = await this.usersService.getUserById( userId );
      // Send last messages to the connected user
      const responseObject: ResponseObject = await this.getResponseObject( groupId, threadId );
      await this.directMessagesService.addUserIdToMessages( user, responseObject.messages );

      return Observable.create(observer =>
        observer.next({ event, data: responseObject }),
    );
    }

    @SubscribeMessage('leave')
    async onRoomLeave(client, data: any) {
      client.leave(data);
    }

    async getResponseObject( groupId: number, threadId: number ): Promise<ResponseObject> {
      const group: Group = await this.groupService.getGroupById( groupId );
      const messages = await this.directMessagesService.getLastThirtyMessages(group.name, threadId);
      const members: Member[] = await this.memberService.getAllMembersInGroup( group );
      const users: User[] = await this.usersService.getUsersByMembership( members );
      const count: number = await this.directMessagesService.getNumberOfMessages(group.id, threadId);
      const responseObject: ResponseObject = new ResponseObject( messages, users , count, true);

      return responseObject;
    }

    async getOnMessageResponseObject( groupId: number, threadId: number, message: DirectMessage): Promise<OnMessageResponse> {
      const group: Group = await this.groupService.getGroupById( groupId );
      const members: Member[] = await this.memberService.getAllMembersInGroup( group );
      const users: User[] = await this.usersService.getUsersByMembership( members );
      const onMessageResponse: OnMessageResponse = new OnMessageResponse( message, users );

      return onMessageResponse;
    }

}
