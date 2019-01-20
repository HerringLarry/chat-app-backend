import { StrippedDownMessage } from "messages/dto/notification.dto";
import { DirectThreadNotification } from "direct-messages/helpers/helpers";

export class NotificationDto{
    threadNotifications: ThreadNotification[];
    directThreadNotifications: DirectThreadNotification[];
    isJoin: boolean;

    constructor( threadNotifications: ThreadNotification[], directThreadNotifications: DirectThreadNotification[] ){
        this.threadNotifications = threadNotifications;
        this.directThreadNotifications = directThreadNotifications;
        this.isJoin = true;
    }
}

export class ThreadNotification{
    threadId: number;
    strippedDownMessages: StrippedDownMessage[];
    isDirectThreadNotification: boolean;
    isJoin: boolean;

    constructor( threadId: number, strippedDownMessages: StrippedDownMessage[], isDirectThreadNotification: boolean ){
        this.threadId = threadId;
        this.strippedDownMessages = strippedDownMessages;
        this.isDirectThreadNotification = isDirectThreadNotification;
        this.isJoin = false;
    }
}
