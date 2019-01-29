import { UsersService } from '../users/users.service';
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Any } from 'typeorm';
import { MessageService } from 'messages/message.service';
import { NotificationDto } from './dto/notification.dto';
import { DirectMessageService } from 'direct-messages/direct-message.service';
import { ThreadNotification } from 'messages/dto/notification.dto';

@Injectable()
export class NotificationsService {

  constructor(
     private _messageService: MessageService,
     private _directMessageService: DirectMessageService,
  ){}

  async getAllThreadNotifications( groupId: number ): Promise<ThreadNotification[]> {
    return await this._messageService.getAllNotifications( groupId );
  }

  async getAllDirectThreadNotifications( groupId: number ): Promise<ThreadNotification[]> {
    return await this._directMessageService.getAllNotifications( groupId );
  }

  async getThreadNotifications( groupId: number, threadId: number ): Promise<ThreadNotification> {
    return await this._messageService.getThreadNotifications( groupId, threadId );
  }

  async getDirectThreadNotifications( groupId: number, threadId: number ): Promise<ThreadNotification> {
    return await this._directMessageService.getThreadNotifications( groupId, threadId );
  }

}