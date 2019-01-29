import { UsersService } from 'users/users.service';
import { GroupService } from '../groups/group.service';
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DirectMessage } from './direct-message.entity';
import { DirectMessageCreationDto } from './dto/direct-message-creation.dto';
import { DirectMessageObject, Query, StrippedDownDirectMessage, DirectThreadNotification, QueryById } from './helpers/helpers';
import { Group } from 'groups/group.entity';
import { User } from 'users/user.entity';
import { Thread } from 'threads/thread.entity';
import { DirectMessageThreadService } from 'direct-message-thread/direct-message-thread.service';
import { DirectMessageThread } from 'direct-message-thread/direct-message-thread.entity';
import { DMThreadWithUsernames } from 'direct-message-thread/helpers/helpers';

@Injectable()
export class DirectMessageService {

  constructor(@InjectRepository(DirectMessage)
  private readonly messageRepository: Repository<DirectMessage>,
              private _groupService: GroupService,
              private _directThreadService: DirectMessageThreadService,
              private _userService: UsersService,
  ){}

  async createMessage( dmMessageCreationDto: DirectMessageCreationDto ): Promise<boolean> {
    const group: Group = await this._groupService.getGroup( dmMessageCreationDto.groupName );
    const thread: DMThreadWithUsernames = await this._directThreadService.getThreadWithId( dmMessageCreationDto.threadId, group );
    const user: User = await this._userService.getUser( dmMessageCreationDto.username );
    const messageObject: DirectMessageObject = new DirectMessageObject( dmMessageCreationDto, group, thread, user );
    const results = await this.messageRepository.save( messageObject );
    return results ? true : false;
  }

  async getMessages( groupName: string, threadId: number ): Promise<DirectMessage[]> {
    const group: Group = await this._groupService.getGroup( groupName );
    const dmThread: DMThreadWithUsernames = await this._directThreadService.getThreadWithId(threadId, group);
    const query: Query = new Query(group, dmThread);

    const results = await this.messageRepository.find(query);

    return results;
  }

  async getMessagesById( groupId: number, threadId: number ): Promise<DirectMessage[]> {
    const query: QueryById = new QueryById(groupId, threadId);

    const results = await this.messageRepository.find( query );

    return results.sort( (a: DirectMessage, b: DirectMessage ) => {
      if ( a.createdAt > b.createdAt ) {
        return 1;
      } else if ( a.createdAt < b.createdAt ) {
        return -1;
      } else {
        return 0;
      }
    });
  }

  async addUserIdToMessages( user: User, messages: DirectMessage[] ): Promise<void> {
    for ( const message of messages ) {
      if ( !this.isUserInUserIds( user, message ) )  {
        message.userIds.push( user.id );
        await this.messageRepository.save(message);
      }
    }
  }

  isUserInUserIds( user: User, message: DirectMessage ): boolean {
    for ( const userId of message.userIds ) {
      if ( user.id === userId ) {

        return true;
      }
    }

    return false;
  }

  async getAllNotifications( groupId: number ): Promise<DirectThreadNotification[]> { // A little complicated, could be simplfiied in future
    const group: Group = await this._groupService.getGroupById( groupId );
    const threads: DirectMessageThread[] = await this._directThreadService.getAllThreadsAssociatedWithGroup(group.id);
    const notifications: DirectThreadNotification[] = [];
    for ( const thread of threads ){
      const directThreadNotification: DirectThreadNotification = await this.getThreadNotifications( groupId, thread.id );
      notifications.push( directThreadNotification );
    }

    return notifications;
  }

  async getThreadNotifications( groupId: number, threadId: number ): Promise<DirectThreadNotification> {
    const messages: DirectMessage[] = await this.getMessagesById( groupId, threadId );
    const strippedDownMessages: StrippedDownDirectMessage[] = this.getStrippedDownMessages( messages );
    const threadNotification: DirectThreadNotification = new DirectThreadNotification(threadId, strippedDownMessages, true );

    return threadNotification;
  }

  private getStrippedDownMessages( messages: DirectMessage[] ): StrippedDownDirectMessage[] {
    const stripped = [];
    for ( const message of messages ) {
      const strippedDownMessage: StrippedDownDirectMessage = new StrippedDownDirectMessage( message );
      stripped.push( strippedDownMessage );
    }

    return stripped;
  }
}