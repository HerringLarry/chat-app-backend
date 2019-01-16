import { UsersService } from 'users/users.service';
import { GroupService } from 'groups/group.service';
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { MessageCreationDto } from './dto/message-creation.dto';
import { MessageObject, Query } from './helpers/helpers';
import { Group } from 'groups/group.entity';
import { User } from 'users/user.entity';
import { Thread } from 'threads/thread.entity';
import { ThreadService } from 'threads/thread.service';
import { Notification, ThreadNotification, StrippedDownMessage } from './dto/notification.dto';
import { NotificationsService } from 'notifications/notifications.service';

@Injectable()
export class MessageService {

  constructor(@InjectRepository(Message)
  private readonly messageRepository: Repository<Message>,
              private _groupService: GroupService,
              private _threadService: ThreadService,
              private _userService: UsersService,
  ){}

  async createMessage( messageCreationDto: MessageCreationDto ): Promise<boolean> {
    const group: Group = await this._groupService.getGroup( messageCreationDto.groupName );
    const thread: Thread = await this._threadService.getThread( messageCreationDto.threadId, messageCreationDto.groupName );
    const user: User = await this._userService.getUser( messageCreationDto.username );
    const messageObject: MessageObject = new MessageObject( messageCreationDto, group, thread, user );
    const results = await this.messageRepository.save( messageObject );

    return results ? true : false;
  }

  async getMessages( groupName: string, threadId: number ): Promise<Message[]> {
    const group: Group = await this._groupService.getGroup( groupName );
    const thread: Thread = await this._threadService.getThread( threadId, groupName );
    const query: Query = new Query(group, thread);
    const results = await this.messageRepository.find(query);

    return results.sort( (a: Message, b: Message ) => {
      if ( a.createdAt > b.createdAt ) {
        return 1;
      } else if ( a.createdAt < b.createdAt ) {
        return -1;
      } else {
        return 0;
      }
    });
  }

  async addUserIdToMessages( user: User, messages: Message[] ): Promise<void> {
    for ( const message of messages ) {
      if ( !this.isUserInUserIds( user, message ) )  {
        message.userIds.push( user.id );
        await this.messageRepository.save(message);
      }
    }
  }

  isUserInUserIds( user, message: Message ): boolean {
    for ( const userId of message.userIds ) {
      if ( user.id === userId ) {

        return true;
      }
    }

    return false;
  }

  async getNotifications( userId: number, groupId: number ): Promise<Notification> { // A little complicated, could be simplfiied in future
    const user: User = await this._userService.getUserById( userId );
    const group: Group = await this._groupService.getGroupById( groupId );
    const threads: Thread[] = await this._threadService.getAllThreadsAssociatedWithGroup(group);
    const notifications: ThreadNotification[] = [];
    for ( const thread of threads ){
      const messages: Message[] = await this.getMessages( group.name, thread.id );
      const strippedDownMessages: StrippedDownMessage[] = this.getStrippedDownMessages( messages );
      const threadNotification: ThreadNotification = new ThreadNotification( thread.id, strippedDownMessages );
      notifications.push( threadNotification );
    }
    const notification: Notification = new Notification( notifications );

    return notification;
  }

  private getStrippedDownMessages( messages: Message[] ): StrippedDownMessage[] {
    const stripped = [];
    for ( const message of messages ) {
      const strippedDownMessage: StrippedDownMessage = new StrippedDownMessage( message );
      stripped.push( strippedDownMessage );
    }

    return stripped;
  }
}