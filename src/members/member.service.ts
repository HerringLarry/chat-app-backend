import { DirectMessageThread } from './../direct-message-thread/direct-message-thread.entity';
import { UsersService } from '../users/users.service';
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Any } from 'typeorm';
import { Member } from './member.entity';
import { MemberCreationDto } from './dto/group-creation.dto';
import { MemberObject, Query, QueryForUsersGroups, QueryForSpecificMember, QueryForAllUsersInGroup, MemberWithAllThreadIds } from './helpers/helpers';
import { User } from 'users/user.entity';
import { Group } from 'groups/group.entity';
import { Thread } from 'threads/thread.entity';
import { ThreadService } from 'threads/thread.service';

@Injectable()
export class MemberService {

  constructor(@InjectRepository(Member)
  private readonly memberRepository: Repository<Member>,
              private _usersService: UsersService,
  ){}

  async createMember( user: User, group: Group ) {
    const memberObject: MemberObject = new MemberObject( group, user );
    return await this.memberRepository.save( memberObject );
  }

  async createMemberWithAllThreads( user: User, group: Group, threads: Thread[] ){
    const memberWithAllThreads: MemberWithAllThreadIds = new MemberWithAllThreadIds( user, group, threads );
    return await this.memberRepository.save(memberWithAllThreads);
  }

  async findAllMemberships( username: string ): Promise<Member[]> {
    const user: User = await this._usersService.findUser( username );
    const query: Query = new Query(user);

    return await this.memberRepository.find(query);
  }

  async addDirectThreadToMultipleMembers( users: User[], group: Group, directThread: DirectMessageThread ): Promise<void> {
    for ( const user of users ){
      await this.addDirectThreadToMember( user, group, directThread );
    }
  }

  async addThreadToMember( user: User, group: Group, thread: Thread): Promise<void> {
    const member: Member = await this.findMember(user, group);
    member.threads.push( thread.id );
    await this.memberRepository.save(member);
  }

  async addDirectThreadToMember( user: User, group: Group, directThread: DirectMessageThread ): Promise<void>{
    const member: Member = await this.findMember(user, group);
    member.directThreads.push( directThread.id );
    await this.memberRepository.save(member);
  }

  async checkIfInGroup( user: User, group: Group ): Promise<boolean> {
    const member: Member = await this.findMember( user, group );

    return member !== undefined;
  }

  async findMember( user: User, group: Group ): Promise<Member>{
    const queryForSpecificMember: QueryForSpecificMember = new QueryForSpecificMember(user, group);
    return await this.memberRepository.findOne(queryForSpecificMember);
  }

  async findAllMembersInGroup( group: Group ): Promise<Member[]>{
    const queryForAllUsersInGroup: QueryForAllUsersInGroup = new QueryForAllUsersInGroup( group );
    return await this.memberRepository.find(queryForAllUsersInGroup);
  }

  async addThreadToAllMembers( group: Group, thread: Thread ): Promise<void> {
    const members: Member[] = await this.findAllMembersInGroup( group );
    for ( const member of members ) {
      member.threads.push(thread.id);
      await this.memberRepository.save(member);
    }
  }
}