import {  DirectMessageCreationDto } from '../dto/direct-message-creation.dto';
import { Group } from 'groups/group.entity';
import { Thread } from 'threads/thread.entity';
import { User } from 'users/user.entity';
import { DirectMessageThread } from 'direct-message-thread/direct-message-thread.entity';

export class DirectMessageObject {
    userId: number;
    groupId: number;
    dmThreadId: number;
    text: string;
    username: string;

    constructor( messageCreationDto: DirectMessageCreationDto, group: Group, dmThread: DirectMessageThread, user: User ){
        this.text = messageCreationDto.text;
        this.groupId = group.id;
        this.dmThreadId = dmThread.id;
        this.userId = user.id;
        this.username = messageCreationDto.username;
    }
}

export class Query {
    groupId: number;
    dmThreadId: number;

    constructor( group: Group, dmThread: DirectMessageThread ){
        this.groupId = group.id;
        this.dmThreadId = dmThread.id;
    }
}
