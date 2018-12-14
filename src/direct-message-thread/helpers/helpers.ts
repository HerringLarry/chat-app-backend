import {  DMThreadCreationDto } from '../dto/thread-creation.dto';
import { Group } from 'groups/group.entity';
import { User } from 'users/user.entity';

export class DMThreadObject {
    userIds: number[];
    groupId: number;
    constructor( users: User[], group: Group ){
        this.userIds = getAllUserIds( users );
        this.groupId = group.id;
    }
}

export class Query {
    userIds: number[];
    groupId: number;
    constructor( users: User[], group: Group ){
        this.userIds = getAllUserIds( users );
        this.groupId = group.id;
    }
}

export function getAllUserIds( users: User[] ): number[] {
    const userIds: number[] = [];
    users.forEach( user => {
        this.userIds.push(user.id);
    });

    return userIds;
}

export class QueryForDMThreadsAssociatedWithGroupAndUser {
    userId: number;
    groupId: number;
    constructor( user: User, group: Group ){
        this.userId = user.id;
        this.groupId = group.id;
    }
}
