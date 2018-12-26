import { GroupService } from './../groups/group.service';
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Thread } from './thread.entity';
import { ThreadCreationDto } from './dto/thread-creation.dto';
import { ThreadObject, Query, QueryForThreadsAssociatedWithGroup } from './helpers/helpers';
import { Group } from '../groups/group.entity';
import { MemberService } from 'members/member.service';
import { UsersService } from 'users/users.service';
import { User } from 'users/user.entity';
import { Member } from 'members/member.entity';

@Injectable()
export class ThreadService {

  constructor(@InjectRepository(Thread)
  private readonly threadRepository: Repository<Thread>,
              private _groupService: GroupService,
              private _memberService: MemberService,
              private _userService: UsersService,
  ){}

  async createThread( threadCreationDto: ThreadCreationDto ): Promise<void> {
    const group: Group = await this._groupService.getGroup( threadCreationDto.groupName );
    const threadObject: ThreadObject = new ThreadObject( threadCreationDto, group );
    await this.threadRepository.save(threadObject);
    const query: Query = new Query(threadObject.name, group);
    const thread: Thread = await this.threadRepository.findOne(query);
    const user: User = await this._userService.findUser(threadCreationDto.username);
    await this._memberService.addThreadToMember(user, group, thread );
  }

  async getThread( name: string, groupName: string ): Promise<Thread> {
    const group: Group = await this._groupService.getGroup( groupName );
    const query: Query = new Query(name, group);
    const results = await this.threadRepository.findOne(query);

    return results;
  }

  async getAllThreadsAssociatedWithMember( groupName: string, username: string ): Promise<Thread[]> {
    const group: Group = await this._groupService.getGroup( groupName );
    const user: User = await this._userService.findUser( username );
    const member: Member = await this._memberService.findMember(user, group);
    if ( member.threads.length > 0){
      const results = await this.threadRepository.find({
        where: {id: In(member.threads)},
      });

      return results;
    } else {

      return [];
    }
  }
}