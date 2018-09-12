import { Profile } from '../profile.entity';

export class UserQuery {
    username: string;
    constructor( username: string ) {
        this.username = username;
    }
}

export class ProfileQuery {
    id: number;
    constructor( profile: Profile) {
        this.id = profile.id;
    }
}