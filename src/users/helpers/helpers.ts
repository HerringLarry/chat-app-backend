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