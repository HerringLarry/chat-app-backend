import { Profile } from '../profile.entity';

export class UserQuery {
    username: string;
    constructor( username: string ) {
        this.username = username;
    }
}
