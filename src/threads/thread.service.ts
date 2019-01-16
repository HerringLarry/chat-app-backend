import { GroupService } from './../groups/group.service';
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Thread } from './thread.entity';
import { ThreadCreationDto } from './dto/thread-creation.dto';
import { ThreadObject, Query, QueryForThreadsAssociatedWithGroup, QueryWithName } from './helpers/helpers';
import { Group } from '../groups/group.entity';
import { MemberService } from 'members/member.service';
import { UsersService } from 'users/users.service';
import { User } from 'users/user.entity';
import { Member } from 'members/member.entity';
import { CreationResponseDto } from './dto/creation-response.dto';
import { NotificationsService } from 'notifications/notifications.service';

@Injectable()
export class ThreadService {

  constructor(@InjectRepository(Thread)
  private readonly threadRepository: Repository<Thread>,
              private _groupService: GroupService,
              private _memberService: MemberService,
              private _userService: UsersService,
  ){}

  async createThread( threadCreationDto: ThreadCreationDto ): Promise<CreationResponseDto> {
    const group: Group = await this._groupService.getGroup( threadCreationDto.groupName );
    const threadObject: ThreadObject = new ThreadObject( threadCreationDto, group );
    const doesThreadExist: Thread = await this.threadRepository.findOne( threadObject );
    let creationResponseDto: CreationResponseDto;
    if ( doesThreadExist !== undefined ){
      creationResponseDto = new CreationResponseDto( doesThreadExist, true );
    }
    if ( doesThreadExist === undefined ) {
      await this.threadRepository.save(threadObject);
      const query: QueryWithName = new QueryWithName(threadObject.name, group.id);
      const thread: Thread = await this.threadRepository.findOne(query);
      creationResponseDto = new CreationResponseDto( thread, false );
      const user: User = await this._userService.getUser(threadCreationDto.username);
      await this._memberService.addThreadToAllMembers(group, thread );
    }

    return creationResponseDto;
  }

  async getThread( id: number , groupName: string ): Promise<Thread> {
    const group: Group = await this._groupService.getGroup( groupName );
    const query: Query = new Query(id, group);
    const results = await this.threadRepository.findOne(query);

    return results;
  }

  async getAllThreadsAssociatedWithMember( groupName: string, username: string ): Promise<Thread[]> {
    const group: Group = await this._groupService.getGroup( groupName );
    const user: User = await this._userService.getUser( username );
    const member: Member = await this._memberService.getMember(user, group);
    if ( member !== undefined && member.threads.length > 0){
      const results = await this.threadRepository.find({
        where: {id: In(member.threads)},
      });

      return results;
    } else {

      return [];
    }
  }

  async getAllThreadsAssociatedWithGroup( group: Group ): Promise<Thread[]> {
    const query: QueryForThreadsAssociatedWithGroup = new QueryForThreadsAssociatedWithGroup( group );

    return await this.threadRepository.find( query );
  }
}