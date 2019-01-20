import {  MessageCreationDto } from '../dto/message-creation.dto';
import { Group } from 'groups/group.entity';
import { Thread } from 'threads/thread.entity';
import { User } from 'users/user.entity';
import { Message } from 'messages/message.entity';

export class MessageObject {
    userId: number;
    userIds: number[];
    groupId: number;
    threadId: number;
    text: string;
    username: string;

    constructor( messageCreationDto: MessageCreationDto, group: Group, thread: Thread, user: User ){
        this.text = messageCreationDto.text;
        this.groupId = group.id;
        this.threadId = thread.id;
        this.userId = user.id;
        this.username = messageCreationDto.username;
        this.userIds = [ user.id ];
    }
}

export class Query {
    groupId: number;
    threadId: number;

    constructor( group: Group, thread: Thread ){
        this.groupId = group.id;
        this.threadId = thread.id;
    }
}

export class QueryById {
    groupId: number;
    threadId: number;

    constructor( groupId: number, threadId: number ){
        this.groupId = groupId;
        this.threadId = threadId;
    }
}

export class ResponseObject{
    messages: Message[];
    users: User[];

    constructor( messages: Message[], users: User[] ) {
        this.messages = messages;
        this.users = users;
    }
}
