import { GroupCreationDto } from './../dto/group-creation.dto';
import { User } from 'users/user.entity';
import { Group } from 'groups/group.entity';
export class GroupObject {
    name: string;
    userIds: number[] = [];
    constructor( groupCreationDto: GroupCreationDto, user: User ){
        this.name = groupCreationDto.name;
        this.userIds.push(user.id);
    }
}

export class Query {
    name: string;
    constructor( name: string ){
        this.name = name;
    }
}

export class QueryForUsersGroups{
    user: User;
    constructor( user: User ){
        this.user = user;
    }
}

export class QueryForGroupById{
    id: number;

    constructor( id: number ){
        this.id = id;
    }
}
