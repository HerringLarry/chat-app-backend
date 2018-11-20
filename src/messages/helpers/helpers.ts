import {  MessageCreationDto } from '../dto/message-creation.dto';
import { Group } from 'groups/group.entity';
import { Thread } from 'threads/thread.entity';
import { User } from 'users/user.entity';

export class MessageObject {
    userId: number
    groupId: number;
    threadId: number;
    text: string;

    constructor( messageCreationDto: MessageCreationDto, group: Group, thread: Thread, user: User​​ ){
        this.text = messageCreationDto.text;
        this.groupId = group.id;
        this.threadId = thread.id;
        this.userId = user.id;
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
