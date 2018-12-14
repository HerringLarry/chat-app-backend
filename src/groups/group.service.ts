import { UsersService } from './../users/users.service';
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Group } from './group.entity';
import { GroupCreationDto } from './dto/group-creation.dto';
import { GroupObject, Query, QueryForUsersGroups } from './helpers/helpers';
import { User } from 'users/user.entity';

@Injectable()
export class GroupService {

  constructor(@InjectRepository(Group)
  private readonly groupRepository: Repository<Group>,
              private _usersService: UsersService,
  ){}

  async createGroup( groupCreationDto: GroupCreationDto ): Promise<boolean> {
    const user: User = await this._usersService.findUser( groupCreationDto.username );
    if ( user ){
      const groupObject: GroupObject = new GroupObject( groupCreationDto, user );
      const results = await this.groupRepository.save(groupObject);
      // create general thread maybe some other standard threads

      return true;
    } else {
      return false;
    }
  }

  async findAllGroupsWithUser( username: string ): Promise<Group[]> {
    const user: User = await this._usersService.findUser( username );
    const groups = await this.groupRepository.find({
      where: { userId: In([user]) },
  });
    return groups;
  }

  async getGroup( name: string ): Promise<Group> {
    const query: Query = new Query(name);
    const results = await this.groupRepository.findOne(query);

    return results;
  }
}