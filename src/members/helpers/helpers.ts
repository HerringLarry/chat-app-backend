import { MemberCreationDto } from './../dto/group-creation.dto';
import { User } from 'users/user.entity';
import { Group } from 'groups/group.entity';
export class MemberObject {
    userId: number;
    groupId: number;
    threads: number[] = [];
    directThreads: number[] = [];
    constructor( group: Group, user: User){
       this.userId = user.id;
       this.groupId = group.id;
    }
}

export class Query {
    userId: number;
    constructor( user: User ){
        this.userId = user.id;
    }
}

export class QueryForUsersGroups{
    user: User;
    constructor( user: User ){
        this.user = user;
    }
}

export class QueryForSpecificMember{
    userId: number;
    groupId: number;
    constructor( user: User, group: Group ){
        this.userId = user.id;
        this.groupId = group.id;
    }
}

export class QueryForAllUsersInGroup{
    groupId: number;
    constructor( group: Group ){
        this.groupId = group.id;
    }
}