import { User } from 'users/user.entity';

export class Query {
    userId: number;

    constructor( userId: number ) {
        this.userId = userId;
    }
}

export class InitializedSettings {
    userId: number;
    showUsername: boolean;
    showNotifications: boolean;

    constructor( user: User, showUsername: boolean, showNotifications: boolean ){
        this.userId = user.id;
        this.showUsername = showUsername;
        this.showNotifications = showNotifications;
    }
}