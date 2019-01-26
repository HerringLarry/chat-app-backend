import { User } from 'users/user.entity';
import { Group } from 'groups/group.entity';
import { ResponseDto } from 'invites/dto/response.dto';
import { InviteDto } from 'invites/dto/invites.dto';
import { Invite } from 'invites/invites.entity';

export class QueryForInvites{
    toUserId: number;
    constructor( user: User ){
        this.toUserId = user.id;
    }
}

export class InviteObject{
    fromUserId: number;
    toUserId: number;
    groupId: number;

    constructor( fromUser: User, toUser: User, group: Group ){
        this.fromUserId = fromUser.id;
        this.toUserId = toUser.id;
        this.groupId = group.id;
    }
}

export class InviteObjectAlt{
    fromUserId: number;
    toUserId: number;
    groupId: number;

    constructor( fromUserId: number, toUserId: number, groupId: number ){
        this.fromUserId = fromUserId;
        this.toUserId = toUserId;
        this.groupId = groupId;
    }
}

export class QueryForInviteById{
    id: number;

    constructor( id: number ){
        this.id = id;
    }
}

export class ModifiedInviteDto{
    fromUser: string;
    toUser: string;
    groupName: string;
    constructor( inviteDto: InviteDto, username: string ){
        this.fromUser = inviteDto.fromUser;
        this.groupName = inviteDto.groupName;
        this.toUser = username;
    }
}

export class AlteredInvite{
    id: number;
    fromUserId: number;
    toUserId: number;
    groupName: string;
    groupId: number;
    constructor( invite: Invite, groupName: string ) {
        this.id = invite.id;
        this.fromUserId = invite.fromUserId;
        this.toUserId = invite.toUserId;
        this.groupId = invite.groupId;
        this.groupName = groupName;
    }
}

export class QueryForInviteByUserAndGroupId{
    toUserId: number;
    groupId: number;

    constructor( userId: number, groupId: number ) {
        this.toUserId = userId;
        this.groupId = groupId;
    }
}

export class QueryByGroupId{
    groupId: number;

    constructor( groupId: number ){
        this.groupId = groupId;
    }
}