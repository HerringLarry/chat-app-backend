import { UsersService } from '../users/users.service';
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Any } from 'typeorm';
import { Notifications } from './notifications.entity';
import { SettingsDto } from './dto/settings.dto';
import { Query, InitializedSettings } from './helpers/helpers';
import { User } from 'users/user.entity';

@Injectable()
export class NotificationsService {

  constructor(@InjectRepository(Notifications)
  private readonly notificationsRepository: Repository<Notifications>,
  ){}

  async createNotifications( userId: number, threadId: number, groupId: number ): Promise<void> {
    
  }
}