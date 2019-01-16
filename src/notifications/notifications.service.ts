import { UsersService } from '../users/users.service';
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Any } from 'typeorm';
import { MessageService } from 'messages/message.service';
import { Notification } from './dto/notification.dto';

@Injectable()
export class NotificationsService {

  constructor(
     private _messageService: MessageService,
  ){}

  async getUserNotifications( userId: number, groupId: number ): Promise<any> {
    return await this._messageService.getNotifications( userId, groupId );
  }

}