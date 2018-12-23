import { UsersService } from '../users/users.service';
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Any } from 'typeorm';
import { Member } from './member.entity';
import { MemberCreationDto } from './dto/group-creation.dto';
import { MemberObject, Query, QueryForUsersGroups } from './helpers/helpers';
import { User } from 'users/user.entity';
import { Group } from 'groups/group.entity';

@Injectable()
export class MemberService {

  constructor(@InjectRepository(Member)
  private readonly memberRepository: Repository<Member>,
              private _usersService: UsersService,
  ){}

  async createMember( user: User, group: Group ) {
    const memberObject: MemberObject = new MemberObject( group, user )

    return await this.memberRepository.save( memberObject );
  }

  async findAllMemberships( username: string ): Promise<Member[]> {
    const user: User = await this._usersService.findUser( username );
    const query: Query = new Query(user);

    return await this.memberRepository.find(query);
  }
}