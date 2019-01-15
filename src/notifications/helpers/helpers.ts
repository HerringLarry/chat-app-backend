export class InitializedNotifications{
    userId: number;
    threadId: number;
    groupId: number;
    notifications: number;
    connected: boolean;

    constructor( userId: number, threadId: number, groupId: number ) {
        this.userId = userId;
        this.threadId = threadId;
        this.groupId = groupId;
        this.notifications = 0; // Initialize notifications count
        this.connected = false;
    }
}

export class Query {
    userId: number;
    groupId: number;

    constructor( userId: number, groupId: number ) {
        this.userId = userId;
        this.groupId = groupId;
    }
}

export class QueryForSpecificNotification {
    userId: number;
    threadId: number;
    groupId: number;

    constructor( userId: number, threadId: number, groupId: number ) {
        this.userId = userId;
        this.threadId = threadId;
        this.groupId = groupId;
    }
}