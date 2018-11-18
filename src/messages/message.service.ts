import { UsersService } from 'users/users.service';
import { GroupService } from '../groups/group.service';
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
    const thread: Thread = await this._threadService.getThread( messageCreationDto.threadName, messageCreationDto.groupName );
    const user: User = await this._userService.findUser( messageCreationDto.username );
    const messageObject: MessageObject = new MessageObject( messageCreationDto, group, thread, user );
    const results = await this.messageRepository.save(messageObject);

    return results ? true : false;
  }

  async getMessage( groupName: string, threadName: string ): Promise<Message[]> {
    const group: Group = await this._groupService.getGroup( groupName );
    const thread: Thread = await this._threadService.getThread( threadName, threadName );
    const query: Query = new Query(group, thread);

    const results = await this.messageRepository.find(query);

    return results;
  }
}