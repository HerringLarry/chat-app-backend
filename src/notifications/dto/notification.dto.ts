export class Notification{
    threadNotifications: ThreadNotification[];

    constructor( threadNotifications: ThreadNotification[] ){
        this.threadNotifications = threadNotifications;
    }
}

export class ThreadNotification{
    threadId: number;
    notificationCount: number;
    constructor( threadId: number, notificationCount: number ){
        this.threadId = threadId;
        this.notificationCount = notificationCount;
    }
}