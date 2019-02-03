import { UsersService } from 'users/users.service';
import { GroupService } from 'groups/group.service';
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { MessageCreationDto } from './dto/message-creation.dto';
import { MessageObject, Query, QueryById, ResponseObjectWithoutCount } from './helpers/helpers';
import { Group } from 'groups/group.entity';
import { User } from 'users/user.entity';
import { Thread } from 'threads/thread.entity';
import { ThreadService } from 'threads/thread.service';
import { Notification, ThreadNotification, StrippedDownMessage } from './dto/notification.dto';
import { NotificationsService } from 'notifications/notifications.service';
import { Member } from 'members/member.entity';
import { MemberService } from 'members/member.service';

@Injectable()
export class MessageService {

  constructor(@InjectRepository(Message)
  private readonly messageRepository: Repository<Message>,
              private _groupService: GroupService,
              private _threadService: ThreadService,
              private _userService: UsersService,
              private _memberService: MemberService,
  ){}

  async createMessage( messageCreationDto: MessageCreationDto ): Promise<MessageObject> {
    const group: Group = await this._groupService.getGroup( messageCreationDto.groupName );
    const thread: Thread = await this._threadService.getThread( messageCreationDto.threadId, messageCreationDto.groupName );
    const user: User = await this._userService.getUser( messageCreationDto.username );
    const messageObject: MessageObject = new MessageObject( messageCreationDto, group, thread, user );
    const results = await this.messageRepository.save( messageObject );

    return results;
  }

  async getThirtyMessages( groupName: string, threadId: number, skipValue: number ): Promise<ResponseObjectWithoutCount> {
    const group: Group = await this._groupService.getGroup( groupName );
    const thread: Thread = await this._threadService.getThread( threadId, groupName );
    const members: Member[] = await this._memberService.getAllMembersInGroup( group );
    const users: User[] = await this._userService.getUsersByMembership( members );
    const sqlWhereConditions = 'message.threadId = :threadId and message.groupId = :groupId';


    const messagesPreSorted = await this.messageRepository
      .createQueryBuilder('message')
      .orderBy('message.id', 'DESC')
      .where(sqlWhereConditions, {threadId: threadId, groupId: group.id})
      .skip(skipValue)
      .take(30)
      .getMany();

    const messages = messagesPreSorted.sort( (a: Message, b: Message ) => {
        if ( a.createdAt > b.createdAt ) {
          return 1;
        } else if ( a.createdAt < b.createdAt ) {
          return -1;
        } else {
          return 0;
        }
      });

    const response = new ResponseObjectWithoutCount(messages, users);

    return response;
  }

  async getLastThirtyMessages( groupName: string, threadId: number ): Promise<Message[]> {
    const group: Group = await this._groupService.getGroup( groupName );
    const thread: Thread = await this._threadService.getThread( threadId, groupName );
    const sqlWhereConditions = 'message.threadId = :threadId and message.groupId = :groupId';

    const messages = await this.messageRepository
      .createQueryBuilder('message')
      .orderBy('message.id', 'DESC')
      .where(sqlWhereConditions, {threadId: threadId, groupId: group.id})
      .skip(0)
      .take(30)
      .getMany();

    return messages.sort( (a: Message, b: Message ) => {
        if ( a.createdAt > b.createdAt ) {
          return 1;
        } else if ( a.createdAt < b.createdAt ) {
          return -1;
        } else {
          return 0;
        }
      });
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

  async getMessagesById( groupId: number, threadId: number ): Promise<Message[]> {
    const query: QueryById = new QueryById(groupId, threadId);

    const results = await this.messageRepository.find( query );

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

  async getNumberOfMessages( groupId: number, threadId: number ): Promise<number> {
    const query: QueryById = new QueryById(groupId, threadId);

    return await this.messageRepository.count(query);
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

  async getAllNotifications( groupId: number ): Promise<ThreadNotification[]> { // A little complicated, could be simplfiied in future
    const group: Group = await this._groupService.getGroupById( groupId );
    const threads: Thread[] = await this._threadService.getAllThreadsAssociatedWithGroup(group);
    const notifications: ThreadNotification[] = [];
    for ( const thread of threads ){
      const threadNotification: ThreadNotification = await this.getThreadNotifications( groupId, thread.id );
      notifications.push( threadNotification );
    }

    return notifications;
  }

  async getThreadNotifications( groupId: number, threadId: number ): Promise<ThreadNotification> {
    const messages: Message[] = await this.getMessagesById( groupId, threadId );
    const strippedDownMessages: StrippedDownMessage[] = this.getStrippedDownMessages( messages );
    const threadNotification: ThreadNotification = new ThreadNotification(threadId, strippedDownMessages, false );

    return threadNotification;
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