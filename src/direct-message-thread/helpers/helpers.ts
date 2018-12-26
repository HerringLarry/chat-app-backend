import {  DMThreadCreationDto } from '../dto/direct-message-thread-creation.dto';
import { Group } from 'groups/group.entity';
import { User } from 'users/user.entity';

export class DMThreadObject {
    name: string;
    groupId: number;
    constructor( users: User[], group: Group ){
        this.name = getAllUserIds( users );
        this.groupId = group.id;
    }
}

export class Query {
    id: number;

    constructor( threadId: number ){
        this.id = threadId;
    }

}

export class QueryForThreadWithName{
    name: string;
    groupName: string;
    constructor( users: User[], group: Group ){
        this.name = getAllUserIds(users);
        this.groupName = group.name;
    }
}

export class QueryForThreadWithNameTwo{
    name: string;
    groupId: number;

    constructor( name: string, group: Group) {
        this.name = name;
        this.groupId = group.id;
    }
}

export function getAllUserIds( users: User[] ): string {
    let name: string;
    users.forEach( user => {
        name = appendToName( name, user );
    });

    return name;
}

export function appendToName( name: string, user: User ){
    if ( name === '' ){
        return user.username;
    } else {
        return name + '/' + user.username;
    }
}

export class QueryForDMThreadsAssociatedWithGroupAndUser {
    userId: number;
    groupId: number;
    constructor( user: User, group: Group ){
        this.userId = user.id;
        this.groupId = group.id;
    }
}
