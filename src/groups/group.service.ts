import { UsersService } from './../users/users.service';
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Any } from 'typeorm';
import { Group } from './group.entity';
import { GroupCreationDto } from './dto/group-creation.dto';
import { GroupObject, Query, QueryForUsersGroups } from './helpers/helpers';
import { User } from 'users/user.entity';
import { MemberService } from 'members/member.service';
import { Member } from 'members/member.entity';

@Injectable()
export class GroupService {

  constructor(@InjectRepository(Group)
  private readonly groupRepository: Repository<Group>,
              private _usersService: UsersService,
              private _memberService: MemberService,
  ){}

  async createGroup( groupCreationDto: GroupCreationDto ): Promise<boolean> {
    const user: User = await this._usersService.findUser( groupCreationDto.username );
    if ( user ){
      const groupObject: GroupObject = new GroupObject( groupCreationDto, user );
      await this.groupRepository.save(groupObject);
      const group: Group = await this.getGroup( groupObject.name );
      await this._memberService.createMember( user, group );
      // create general thread maybe some other standard threads

      return true;
    } else {
      return false;
    }
  }

  async findAllGroupsWithUser( username: string ): Promise<Group[]> {
    const members: Member[] =  await this._memberService.findAllMemberships(username);
    const groupIds: number[] = [];
    members.forEach( member => {
      groupIds.push(member.groupId);
    });

    return await this.groupRepository.find({
      where: {id: In(groupIds)},
    });
  }

  async getGroup( name: string ): Promise<Group> {
    const query: Query = new Query(name);
    const results = await this.groupRepository.findOne(query);

    return results;
  }
}