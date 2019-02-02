import { UsersService } from './../users/users.service';
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Any } from 'typeorm';
import { Group } from './group.entity';
import { GroupCreationDto } from './dto/group-creation.dto';
import { GroupObject, Query, QueryForUsersGroups, QueryForGroupById } from './helpers/helpers';
import { User } from 'users/user.entity';
import { MemberService } from 'members/member.service';
import { Member } from 'members/member.entity';
import { ThreadService } from 'threads/thread.service';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class GroupService {

  private _threadService: ThreadService;

  constructor(@InjectRepository(Group)

  private readonly groupRepository: Repository<Group>,
              private _usersService: UsersService,
              private _memberService: MemberService,
              private readonly moduleRef: ModuleRef,

  ){}

  async createGroup( groupCreationDto: GroupCreationDto ): Promise<boolean> {
    const user: User = await this._usersService.getUser( groupCreationDto.username );
    if ( user ){
      const groupObject: GroupObject = new GroupObject( groupCreationDto, user );
      const groupExists: Group = await this.groupRepository.findOne( groupObject );
      if ( groupExists === undefined ) {
        await this.groupRepository.save(groupObject);
        const group: Group = await this.getGroup( groupObject.name );
        await this._memberService.createMember( user, group );
        // create general thread maybe some other standard threads
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  async getAllGroupsWithUser( username: string ): Promise<Group[]> {
    const members: Member[] =  await this._memberService.getAllMemberships(username);
    if ( members.length > 0 ) {
      const groupIds: number[] = [];
      members.forEach( member => {
        groupIds.push(member.groupId);
      });

      return await this.groupRepository.find({
        where: {id: In(groupIds)},
      });
    } else {
      return [];
    }
  }

  async getGroup( name: string ): Promise<Group> {
    const query: Query = new Query(name);
    const results = await this.groupRepository.findOne(query);

    return results;
  }

  async getAllUsersInGroup( username: string, groupName: string ): Promise<User[]>{
    const group: Group = await this.getGroup(groupName);
    const members: Member[] = await this._memberService.getAllMembersInGroup( group );
    const users: User[] = await this._usersService.getUsersByMembership( members );

    return users;
  }

  async getGroupById( groupId: number ): Promise<Group> {
    const query: QueryForGroupById = new QueryForGroupById( groupId );

    return await this.groupRepository.findOne( query );
  }
}