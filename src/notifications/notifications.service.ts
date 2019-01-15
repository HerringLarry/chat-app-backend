import { UsersService } from '../users/users.service';
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Any } from 'typeorm';
import { Notifications } from './notifications.entity';
import { SettingsDto } from './dto/settings.dto';
import { InitializedNotifications, Query, QueryForSpecificNotification } from './helpers/helpers';
import { User } from 'users/user.entity';
import { Member } from 'members/member.entity';

@Injectable()
export class NotificationsService {

  constructor(@InjectRepository(Notifications)
  private readonly notificationsRepository: Repository<Notifications>,
  ){}

  async getAllNotificationsForUserInGroup( userId: number, groupId: number ): Promise<Notifications[]> {
    const query: Query = new Query( userId, groupId );

    return await this.notificationsRepository.find( query );
  }

  async createNotificationsForNewlyJoinedUser( member: any ): Promise<void> { // better typing later
    for (const threadId of member.threads) {
      await this.createInitializedNotifications( member.userId, threadId, member.groupId );
    }
  }

  async createNotificationsForEachUserAfterThreadCreation( newThreadId: number, members: Member[] ): Promise<void> {
    for ( const member of members ) {
      await this.createInitializedNotifications( member.userId, newThreadId, member.groupId );
    }
  }

  async createInitializedNotifications( userId: number, threadId: number, groupId: number ): Promise<void> {
    const initializedNotifications: InitializedNotifications = new InitializedNotifications( userId, threadId, groupId);
    await this.notificationsRepository.save( initializedNotifications );
  }

  async updateAllNotificationsForThreadInGroup( groupId: number, threadId: number ): Promise<void> {
    const notifications: Notifications[] = await this.notificationsRepository.find({
      groupId: groupId,
      threadId: threadId,
    });
    await this.updateNotificationsCount( notifications );
  }

  private consolidateUserIds( members: Member[] ): number[] {
    const userIds: number[] = [];
    for ( const member of members ) {
      userIds.push( member.userId );
    }

    return userIds;
  }

  async updateNotificationsCount( notifications: Notifications[] ): Promise<void> {
    for ( const notification of notifications ) {
      if ( !notification.connected ) {
        notification.notifications += 1;
        await this.notificationsRepository.save( notification );
      }
    }
  }

  async resetNotificationsCountAndSetConnectedToTrue( userId: number, threadId: number, groupId: number ): Promise<void> {
    const queryForSpecificNotification: QueryForSpecificNotification = new QueryForSpecificNotification( userId, threadId, groupId );
    const notification: Notifications = await this.notificationsRepository.findOne( queryForSpecificNotification );
    notification.notifications = 0;
    notification.connected = true;
    await this.notificationsRepository.save( notification );
  }

  async setConnectedToFalse( userId: number, threadId: number, groupId: number): Promise<void> {
    const queryForSpecificNotification: QueryForSpecificNotification = new QueryForSpecificNotification( userId, threadId, groupId);
    const notification: Notifications = await this.notificationsRepository.findOne( queryForSpecificNotification );
    notification.connected = false;
    await this.notificationsRepository.save( notification );
  }
}