export class UserQuery {
    username: string;
    constructor( username: string ) {
        this.username = username;
    }
}

export class ProfileQuery {
    id: number;
    constructor( id: number ) {
        this.id = id;
    }
}