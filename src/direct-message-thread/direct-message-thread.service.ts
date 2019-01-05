import { UsersService } from './../users/users.service';
import { GroupService } from '../groups/group.service';
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { DirectMessageThread } from './direct-message-thread.entity';
import { DMThreadCreationDto } from './dto/direct-message-thread-creation.dto';
import { DMThreadObject, Query, QueryForDMThreadsAssociatedWithGroupAndUser, QueryForThreadWithUsers as QueryForThreadWithUsers, QueryForThreadWithId as QueryForThreadWithId, DMThreadWithUsernames } from './helpers/helpers';
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
    const queryForThreadWithUsers: QueryForThreadWithUsers = new QueryForThreadWithUsers(users, group);
    const directThreadCheck = await this.dmThreadRepository.findOne(queryForThreadWithUsers);
    let results = null;
    if ( directThreadCheck === undefined){
      results = await this.dmThreadRepository.save(threadObject);
      const directThread = await this.dmThreadRepository.findOne(queryForThreadWithUsers);
      await this._memberService.addDirectThreadToMultipleMembers(users, group, directThread);
    }
    return results ? true : false;
  }

  async getThread( threadId: number ): Promise<DMThreadWithUsernames> {
    const query: Query = new Query( threadId );
    const results = await this.dmThreadRepository.findOne(query);

    return await this.addUsernamesAndCreateDMThreadWithUsernames( results );
  }

  async getThreadWithId( threadId: number, group: Group ): Promise<DMThreadWithUsernames> {
    const query: QueryForThreadWithId = new QueryForThreadWithId( threadId, group );
    const result =  await this.dmThreadRepository.findOne( query );

    return await this.addUsernamesAndCreateDMThreadWithUsernames( result );
  }

  async getAllThreadsAssociatedWithGroupAndUser( username: string, groupName: string ): Promise<DMThreadWithUsernames[]> {
    const group: Group = await this._groupService.getGroup( groupName );
    const user: User = await this._userService.findUser( username );
    const member: Member = await this._memberService.findMember( user, group );
    if ( member !== undefined && member.directThreads.length > 0 ) {
      const results = await this.dmThreadRepository.find({
        where: {id: In(member.directThreads)},
      });

      return await this.processMultiple( results );
    } else {

      return [];
    }
  }

  async processMultiple( DMThreads: DirectMessageThread[] ): Promise<DMThreadWithUsernames[]> {
    const dMThreadWithUsernames: DMThreadWithUsernames[] = [];
    for ( const dmThread of DMThreads ){
      const processed: DMThreadWithUsernames = await this.addUsernamesAndCreateDMThreadWithUsernames( dmThread );
      dMThreadWithUsernames.push( processed );
    }

    return dMThreadWithUsernames;
  }

  async addUsernamesAndCreateDMThreadWithUsernames( DMThread: DirectMessageThread ): Promise<DMThreadWithUsernames> {
    const users: User[] = await this._userService.getAllUsersInIds( DMThread );
    const dMThreadWithUsernames: DMThreadWithUsernames = new DMThreadWithUsernames( users, DMThread.groupId, DMThread.id );

    return dMThreadWithUsernames;
  }
}