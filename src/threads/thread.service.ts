import { GroupService } from './../groups/group.service';
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Thread } from './thread.entity';
import { ThreadCreationDto } from './dto/thread-creation.dto';
import { ThreadObject, Query, QueryForThreadsAssociatedWithGroup } from './helpers/helpers';
import { Group } from '../groups/group.entity';

@Injectable()
export class ThreadService {

  constructor(@InjectRepository(Thread)
  private readonly threadRepository: Repository<Thread>,
              private _groupService: GroupService,
  ){}

  async createThread( threadCreationDto: ThreadCreationDto ): Promise<boolean> {
    const group: Group = await this._groupService.getGroup( threadCreationDto.groupName );
    const threadObject: ThreadObject = new ThreadObject( threadCreationDto, group );
    const results = await this.threadRepository.save(threadObject);

    return results ? true : false;
  }

  async getThread( name: string, groupName: string ): Promise<Thread> {
    const group: Group = await this._groupService.getGroup( groupName );
    const query: Query = new Query(name, group);
    const results = await this.threadRepository.findOne(query);

    return results;
  }

  async getAllThreadsAssociatedWithGroup( groupName: string ): Promise<Thread[]> {
    const group: Group = await this._groupService.getGroup( groupName );
    const queryForThreadsAssociatedWithGroup: QueryForThreadsAssociatedWithGroup = new QueryForThreadsAssociatedWithGroup( group );
    const results = await this.threadRepository.find( queryForThreadsAssociatedWithGroup );

    return results;
  }
}