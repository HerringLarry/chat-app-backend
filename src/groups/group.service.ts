import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './group.entity';
import { GroupCreationDto } from './dto/group-creation.dto';
import { GroupObject, Query } from './helpers/helpers';

@Injectable()
export class GroupService {

  constructor(@InjectRepository(Group)
  private readonly groupRepository: Repository<Group> ){}

  async createGroup( groupCreationDto: GroupCreationDto ): Promise<boolean> {
    const groupObject: GroupObject = new GroupObject( groupCreationDto );
    const results = await this.groupRepository.save(groupObject);
    // create general thread maybe some other standard threads

    return results ? true : false;
  }

  async getGroup( name: string ): Promise<Group> {
    const query: Query = new Query(name);
    const results = await this.groupRepository.findOne(query);

    return results;
  }
}