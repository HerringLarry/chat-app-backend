import { QueryForAllUsersInGroup } from '../members/helpers/helpers';
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import {  Invite } from './invites.entity';
import { QueryForInvites, InviteObject, QueryForInviteById, ModifiedInviteDto, AlteredInvite, QueryForInviteByUserAndGroupId } from './helpers/helpers';
import { Member } from 'members/member.entity';
import { DirectMessageThread } from 'direct-message-thread/direct-message-thread.entity';
import { UsersService } from 'users/users.service';
import { User } from 'users/user.entity';
import { InviteDto } from './dto/invites.dto';
import { Group } from 'groups/group.entity';
import { GroupService } from 'groups/group.service';
import { ResponseDto } from './dto/response.dto';
import { MemberService } from 'members/member.service';
import { ThreadService } from 'threads/thread.service';
import { Thread } from 'threads/thread.entity';

@Injectable()
export class InvitesService {

  constructor(@InjectRepository(Invite)
    private readonly inviteRepository: Repository<Invite>,
              private _usersService: UsersService,
              private _groupService: GroupService,
              private _memberService: MemberService,
              private _threadService: ThreadService,
  ){}

  async getAllInvitesForUser( username: string ): Promise<AlteredInvite[]> {
    const user: User = await this._usersService.findUser( username );
    const queryForInvites: QueryForInvites = new QueryForInvites( user );
    const invites: Invite[] = await this.inviteRepository.find(queryForInvites);
    const alteredInvites: AlteredInvite[] = [];
    for ( const invite of invites ) {
      const altered: AlteredInvite = await this.getAlteredInvite( invite );
      alteredInvites.push( altered );
    }

    return alteredInvites;
  }

  async getAlteredInvite( invite: Invite ): Promise<AlteredInvite> {
    const group: Group = await this._groupService.getGroupById( invite.groupId );
    const altered: AlteredInvite = new AlteredInvite( invite, group.name );

    return altered;
  }

  async createMultipleInvites( inviteDto: InviteDto ): Promise<void> {
    for ( const username of inviteDto.toUsers ){
      const modifiedInviteDto: ModifiedInviteDto = new ModifiedInviteDto( inviteDto, username );
      await this.createInvite( modifiedInviteDto );
    }
  }

  async createInvite( modifiedInviteDto: ModifiedInviteDto ): Promise<void> {
    const toUser: User = await this._usersService.findUser( modifiedInviteDto.toUser );
    const fromUser: User = await this._usersService.findUser( modifiedInviteDto.fromUser );
    const group: Group = await this._groupService.getGroup( modifiedInviteDto.groupName );
    if ( fromUser !== undefined && toUser !== undefined && group !== undefined ) {
      const invite: InviteObject = new InviteObject( fromUser, toUser, group );
      await this.inviteRepository.save( invite );
    } else {

      return;
    }
  }

  async respondToInvite( responseDto: ResponseDto ){
    if ( responseDto.accepted ) {
      await this.acceptInvite( responseDto );
    } else {
      await this.declineInvite( responseDto );
    }
  }

  async acceptInvite( responseDto ): Promise<void> {
    const invite: Invite = await this.findInviteById( responseDto.inviteId );
    const user: User = await this._usersService.findUserById( invite.toUserId );
    const group: Group = await this._groupService.getGroupById( invite.groupId );
    const threads: Thread[] = await this._threadService.getAllThreadsAssociatedWithGroup( group );
    await this._memberService.createMemberWithAllThreads(user, group, threads );
    await this.inviteRepository.delete( invite );
  }

  async declineInvite( responseDto ): Promise<void> {
    const invite: Invite = await this.findInviteById( responseDto.inviteId );
    await this.inviteRepository.delete( invite );
  }

  async findInviteById( id: number ): Promise<Invite> {
    const query: QueryForInviteById = new QueryForInviteById( id );
    return await this.inviteRepository.findOne(query);
  }

  async getListOfRelevantUsers( groupName: string, username: string ): Promise<User[]> {
    let users: User[] = await this._usersService.getAllUsers();
    const usersIterable: User[] = users.slice();
    const group: Group = await this._groupService.getGroup( groupName );
    for (const user of usersIterable ) {
      const isAlreadyInGroup: boolean = await this._memberService.checkIfInGroup( user, group );
      if ( isAlreadyInGroup ) {
        users = this.removeFromListOfUsers( user, users);
      } else {
        const isAlreadyInvited: boolean = await this.checkIfInvited( user.id, group.id );
        if ( isAlreadyInvited ) {
          this.removeFromListOfUsers( user, users );
        }
      }
    }

    return users;
  }

  removeFromListOfUsers( user: User, users: User[] ): User[] {
    const index = users.findIndex( (elem => {
      return elem.id === user.id;
    }));
    users.splice(index, 1);

    return users;
  }

  async checkIfInvited( userId: number, groupId: number ): Promise<boolean> {
    const query: QueryForInviteByUserAndGroupId = new QueryForInviteByUserAndGroupId( userId, groupId );
    const invite: Invite = await this.inviteRepository.findOne( query );

    return invite !== undefined;
  }

}