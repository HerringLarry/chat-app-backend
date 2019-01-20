import { GroupService } from '../groups/group.service';
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
import { Group } from 'groups/group.entity';
import { Member } from 'members/member.entity';
import { NotificationsService } from './notifications.service';
import { NotificationDto, ThreadNotification } from './dto/notification.dto';
import { MessageService } from 'messages/message.service';
import { Message } from 'messages/message.entity';
import { DirectThreadNotification } from 'direct-messages/helpers/helpers';
import { DirectMessageService } from 'direct-messages/direct-message.service';
import { DirectMessage } from 'direct-messages/direct-message.entity';

@WebSocketGateway(9997)
  export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server;

    connectedUsers: string[] = [];

    constructor(
      private _notificationsService: NotificationsService,
      private _usersService: UsersService,
      private _messageService: MessageService,
      private _directMessageService: DirectMessageService,
      private _groupService: GroupService,
    ) {}

    async handleConnection(socket) {
        this.connectedUsers = [...this.connectedUsers, String(socket.handshake.query.userId)];
        // Send list of connected users
        this.server.emit('users', this.connectedUsers);

    }

    async handleDisconnect(socket) {
      const userPos = this.connectedUsers.indexOf(String(socket.handshake.query.userId));

      if (userPos > -1) {
        this.connectedUsers = [
          ...this.connectedUsers.slice(0, userPos),
          ...this.connectedUsers.slice(userPos + 1),
        ];
        // Sends the new list of connected users
        this.server.emit('users', this.connectedUsers);
      }
    }

    @SubscribeMessage('markAsRead')
    async markAsRead(client, data: any){
      const groupId: number = data.split('/')[0];
      const threadId: number = data.split('/')[1];
      console.log(groupId, threadId );
      const user: User = await this._usersService.getUserById( client.handshake.query.userId);
      const group: Group = await this._groupService.getGroupById( groupId );
      const messages: Message[] = await this._messageService.getMessages(group.name, threadId);
      await this._messageService.addUserIdToMessages(user, messages);
      const notification: ThreadNotification = await this._notificationsService.getThreadNotifications( groupId, threadId );
      client.emit(event, notification);

      return Observable.create(observer =>
          observer.next({ event, data: notification}),
      );
    }

    @SubscribeMessage('directMarkAsRead')
    async directMarkAsRead(client, data: any){
      const groupId: number = data.split('/')[0];
      const threadId: number = data.split('/')[1];
      const user: User = await this._usersService.getUserById( client.handshake.query.userId);
      const group: Group = await this._groupService.getGroupById( groupId );
      const directMessages: DirectMessage[] = await this._directMessageService.getMessages(group.name, threadId);
      await this._directMessageService.addUserIdToMessages(user, directMessages);
      const notification: ThreadNotification = await this._notificationsService.getDirectThreadNotifications( groupId, threadId );

      client.emit(event, notification);

      return Observable.create(observer =>
          observer.next({ event, data: notification }),
      );
    }

    @SubscribeMessage('message')
    async onMessage(client, data: any) { // Add Notifications to non-listed users
        const event: string = 'message';
        const result = data;
        console.log(result);
        // await this._notificationsService.updateAllNotificationsForThreadInGroup( data.groupId, data.threadId);
        const notification: ThreadNotification = await this._notificationsService.getThreadNotifications( result.groupId, result.threadId );
        client.broadcast.to(Number(data.groupId)).emit(event, notification);

        return Observable.create(observer =>
          observer.next({ event, data: notification }),
      );
    }

    @SubscribeMessage('directMessage')
    async onDirectMessage(client, data: any) { // Add Notifications to non-listed users
        const event: string = 'message';
        const result = data;
        // await this._notificationsService.updateAllNotificationsForThreadInGroup( data.groupId, data.threadId);
        // tslint:disable-next-line:max-line-length
        const notification: DirectThreadNotification = await this._notificationsService.getDirectThreadNotifications( result.groupId, result.threadId );
        client.broadcast.to(Number(data.groupId)).emit(event, notification);

        return Observable.create(observer =>
          observer.next({ event, data: notification }),
      );
    }

    @SubscribeMessage('join')
    async onRoomJoin(client, data: any): Promise<any> { // Reset notifications and reset client username on frontend
      const event: string = 'message';
      const userId: number = data.split('/')[0];
      const groupId: number = data.split('/')[1];
      client.join(groupId);
      const threadNotifications: ThreadNotification[] = await this._notificationsService.getAllThreadNotifications( groupId );
      const directNotifications: DirectThreadNotification[] = await this._notificationsService.getAllDirectThreadNotifications( groupId );
      const notificationDto: NotificationDto = new NotificationDto( threadNotifications, directNotifications );
      // Send last messages to the connected user
      client.emit(event, notificationDto);

      return Observable.create(observer =>
        observer.next({ event, data: notificationDto }),
    );
    }

    @SubscribeMessage('leave')
    async onRoomLeave(client, data: any) {
      const groupId: number = data;
      client.leave(groupId);
    }
}
