import { Member } from "members/member.entity";
import { User } from "users/user.entity";

export class Query {
    username: string;
    constructor( username: string ){
        this.username = username;
    }
}

export class UserExistsQuery {
    username: string;
    password: string;
    constructor( username: string, password: string ){
        this.username = username;
        this.password = password;
    }
}

export class QueryForUsersFromMembers{
    userIds: number[] = [];
    constructor( members: Member[] ) {
        for ( const member of members) {
            this.userIds.push( member.userId );
        }
    }
}

export class QueryById {
    id: number;

    constructor( userId: number ){
        this.id = userId;
    }
}