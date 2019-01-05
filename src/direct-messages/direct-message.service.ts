import { UsersService } from 'users/users.service';
import { GroupService } from '../groups/group.service';
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DirectMessage } from './direct-message.entity';
import { DirectMessageCreationDto } from './dto/direct-message-creation.dto';
import { DirectMessageObject, Query } from './helpers/helpers';
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
    const user: User = await this._userService.findUser( dmMessageCreationDto.username );
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
}