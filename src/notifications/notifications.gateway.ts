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
import { Notification } from './dto/notification.dto';

@WebSocketGateway(9997)
  export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server;

    connectedUsers: string[] = [];

    constructor(
      private _notificationsService: NotificationsService,
      private _usersService: UsersService,
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

    @SubscribeMessage('message')
    async onMessage(client, data: any) { // Add Notifications to non-listed users
        const event: string = 'message';
        const result = data;
        // await this._notificationsService.updateAllNotificationsForThreadInGroup( data.groupId, data.threadId);
        const notification: Notification = await this._notificationsService.getUserNotifications( result.userId, result.groupId );
        client.broadcast.to(data.groupId).emit(event, notification);

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
      const notifications: Notification = await this._notificationsService.getUserNotifications( userId, groupId );
      // Send last messages to the connected user
      client.emit(event, notifications);

      return Observable.create(observer =>
        observer.next({ event, data: notifications }),
    );
    }

    @SubscribeMessage('leave')
    async onRoomLeave(client, data: any) {
      const groupId: number = data;
      client.leave(groupId);
    }
}
