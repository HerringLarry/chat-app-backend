import {  DirectMessageCreationDto } from '../dto/direct-message-creation.dto';
import { Group } from 'groups/group.entity';
import { Thread } from 'threads/thread.entity';
import { User } from 'users/user.entity';
import { DirectMessageThread } from 'direct-message-thread/direct-message-thread.entity';
import { DMThreadWithUsernames } from 'direct-message-thread/helpers/helpers';
import { DirectMessage } from 'direct-messages/direct-message.entity';

export class DirectMessageObject {
    userId: number;
    groupId: number;
    threadId: number;
    text: string;
    username: string;
    userIds: number[];

    constructor( messageCreationDto: DirectMessageCreationDto, group: Group, dmThread: DMThreadWithUsernames, user: User ){
        this.text = messageCreationDto.text;
        this.groupId = group.id;
        this.threadId = dmThread.id;
        this.userId = user.id;
        this.username = messageCreationDto.username;
        this.userIds = [user.id];
    }
}

export class Query {
    groupId: number;
    threadId: number;

    constructor( group: Group, dmThread: DMThreadWithUsernames){
        this.groupId = group.id;
        this.threadId = dmThread.id;
    }
}

export class ResponseObject {
    users: User[];
    messages: DirectMessage[];

    constructor( users: User[] , directMessages: DirectMessage[] ) {
        this.users = users;
        this.messages = directMessages;
    }
}

export class DirectThreadNotification {
    threadId: number;
    strippedDownMessages: StrippedDownDirectMessage[];
    isDirectThreadNotification: boolean;

    constructor( threadId: number, strippedDownMessages: StrippedDownDirectMessage[], isDirectThreadNotification: boolean ){
        this.threadId = threadId;
        this.strippedDownMessages = strippedDownMessages;
        this.isDirectThreadNotification = isDirectThreadNotification;
     }
}

export class StrippedDownDirectMessage{
    id: number;
    userIds: number[];

    constructor( message: DirectMessage ) {
        this.id = message.id;
        this.userIds = message.userIds;
    }
}

export class QueryById {
    threadId: number;
    groupId: number;

    constructor( groupId: number, threadId: number ){
        this.threadId = threadId;
        this.groupId = groupId;
    }

}