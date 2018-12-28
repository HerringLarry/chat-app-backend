import {  DMThreadCreationDto } from '../dto/direct-message-thread-creation.dto';
import { Group } from 'groups/group.entity';
import { User } from 'users/user.entity';

export class DMThreadObject {
    name: string;
    groupId: number;
    constructor( usernames: string[], group: Group ){
        this.name = getAllUserIds( usernames );
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
    constructor( usernames: string[], group: Group ){
        this.name =  getAllUserIds(usernames);
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

export function getAllUserIds( usernames: string[] ): string {
    let name: string = '';
    usernames.forEach( username => {
        name = appendToName( name, username );
    });

    return name;
}

export function appendToName( name: string, username: string ){
    if ( name === '' ){
        return username;
    } else {
        return name + '|' + username;
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
