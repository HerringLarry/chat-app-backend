import { Message } from "messages/message.entity";

export class Notification{
    threadNotifications: ThreadNotification[];

    constructor( threadNotifications: ThreadNotification[] ){
        this.threadNotifications = threadNotifications;
    }
}

export class ThreadNotification {
    threadId: number;
    strippedDownMessages: StrippedDownMessage[];
    constructor( threadId: number, strippedDownMessages: StrippedDownMessage[] ){
        this.threadId = threadId;
        this.strippedDownMessages = strippedDownMessages;
     }
}

export class StrippedDownMessage{
    id: number;
    userIds: number[];

    constructor( message: Message ) {
        this.id = message.id;
        this.userIds = message.userIds;
    }
}
