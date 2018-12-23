import { UsersService } from './../users/users.service';
import { GroupService } from '../groups/group.service';
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DirectMessageThread } from './direct-message-thread.entity';
import { DMThreadCreationDto } from './dto/direct-message-thread-creation.dto';
import { DMThreadObject, Query, QueryForDMThreadsAssociatedWithGroupAndUser } from './helpers/helpers';
import { Group } from '../groups/group.entity';
import { User } from 'users/user.entity';

@Injectable()
export class DirectMessageThreadService {

  constructor(@InjectRepository(DirectMessageThread)
  private readonly dmThreadRepository: Repository<DirectMessageThread>,
              private _groupService: GroupService,
              private _userService: UsersService,
  ){}

  async createDirectMessageThread( dmThreadCreationDto: DMThreadCreationDto ): Promise<boolean> {
    const group: Group = await this._groupService.getGroup( dmThreadCreationDto.groupName );
    const users: User[] = await this._userService.findUsers( dmThreadCreationDto.userNames );
    const threadObject: DMThreadObject = new DMThreadObject( users, group );
    const results = await this.dmThreadRepository.save(threadObject);

    return results ? true : false;
  }

  async getThread( threadId: number ): Promise<DirectMessageThread> {
    const query: Query = new Query( threadId );
    const results = await this.dmThreadRepository.findOne(query);

    return results;
  }

  async getAllThreadsAssociatedWithGroupAndUser( username: string, groupName: string ): Promise<DirectMessageThread[]> {
    const group: Group = await this._groupService.getGroup( groupName );
    const user: User = await this._userService.findUser( username );
    const queryForAllDM: QueryForDMThreadsAssociatedWithGroupAndUser = new QueryForDMThreadsAssociatedWithGroupAndUser( user, group );
    const results = await this.dmThreadRepository.find( queryForAllDM );

    return results;
  }
}