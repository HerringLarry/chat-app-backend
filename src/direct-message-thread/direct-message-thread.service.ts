import { UsersService } from './../users/users.service';
import { GroupService } from '../groups/group.service';
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { DirectMessageThread } from './direct-message-thread.entity';
import { DMThreadCreationDto } from './dto/direct-message-thread-creation.dto';
import { DMThreadObject, Query, QueryForDMThreadsAssociatedWithGroupAndUser, QueryForThreadWithName, QueryForThreadWithNameTwo } from './helpers/helpers';
import { Group } from '../groups/group.entity';
import { User } from 'users/user.entity';
import { MemberService } from 'members/member.service';
import { Member } from 'members/member.entity';

@Injectable()
export class DirectMessageThreadService {

  constructor(@InjectRepository(DirectMessageThread)
  private readonly dmThreadRepository: Repository<DirectMessageThread>,
              private _groupService: GroupService,
              private _userService: UsersService,
              private _memberService: MemberService,
  ){}

  async createDirectMessageThread( dmThreadCreationDto: DMThreadCreationDto ): Promise<boolean> {
    const group: Group = await this._groupService.getGroup( dmThreadCreationDto.groupName );
    const users: User[] = await this._userService.findUsers( dmThreadCreationDto.userNames );
    const threadObject: DMThreadObject = new DMThreadObject( users, group );
    const results = await this.dmThreadRepository.save(threadObject);
    const queryForThreadWithName: QueryForThreadWithName = new QueryForThreadWithName(users, group);
    const directThread = await this.dmThreadRepository.findOne(queryForThreadWithName);
    this._memberService.addDirectThreadToMultipleMembers(users, group, directThread);

    return results ? true : false;
  }

  async getThread( threadId: number ): Promise<DirectMessageThread> {
    const query: Query = new Query( threadId );
    const results = await this.dmThreadRepository.findOne(query);

    return results;
  }

  async getThreadWithName( threadName: string, group: Group ): Promise<DirectMessageThread> {
    const query: QueryForThreadWithNameTwo = new QueryForThreadWithNameTwo( threadName, group );

    return await this.dmThreadRepository.findOne( query );
  }

  async getAllThreadsAssociatedWithGroupAndUser( username: string, groupName: string ): Promise<DirectMessageThread[]> {
    const group: Group = await this._groupService.getGroup( groupName );
    const user: User = await this._userService.findUser( username );
    const member: Member = await this._memberService.findMember( user, group );
    if ( member.directThreads.length > 0 ) {
      const results = await this.dmThreadRepository.find({
        where: {id: In(member.directThreads)},
      });

      return results;
    } else {

      return [];
    }
  }
}