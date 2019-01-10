import {  DMThreadCreationDto } from '../dto/direct-message-thread-creation.dto';
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

export class DMThreadWithUsernames {
    id: number;
    usernames: string[];
    groupId: number;
    constructor( users: User[], groupId: number, id: number){
        this.usernames = getAllUsernames( users );
        this.groupId = groupId;
        this.id = id;
    }
}

export class Query {
    id: number;

    constructor( threadId: number ){
        this.id = threadId;
    }

}

export class QueryForThreadWithUsers{
    userIds: number[];
    groupId: number;
    constructor( users: User[], group: Group ){
        this.userIds =  getAllUserIds(users);
        this.groupId = group.id;
    }
}

export class QueryForThreadWithId{
    id: number;
    groupId: number;

    constructor( threadId: number, group: Group) {
        this.id = threadId;
        this.groupId = group.id;
    }
}

export function getAllUserIds( users: User[] ): number[] {
    const ids = [];
    for ( const user of users ) {
        ids.push( user.id );
    }

    return ids.sort();
}

export function getAllUsernames( users: User[] ): string[] {
    const usernames = [];
    users.forEach( user => {
        usernames.push( user.username );
    });

    return usernames;
}

export class QueryForDMThreadsAssociatedWithGroupAndUser {
    userId: number;
    groupId: number;
    constructor( user: User, group: Group ){
        this.userId = user.id;
        this.groupId = group.id;
    }
}
