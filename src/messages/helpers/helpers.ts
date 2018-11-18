import {  MessageCreationDto } from '../dto/message-creation.dto';
import { Group } from 'groups/group.entity';
import { Thread } from 'threads/thread.entity';
import { User } from 'users/user.entity';

export class MessageObject {
    user: User;
    group: Group;
    thread: Thread;
    text: string;

    constructor( messageCreationDto: MessageCreationDto, group: Group, thread: Thread, user: User​​ ){
        this.text = messageCreationDto.text;
        this.group = group;
        this.thread = thread;
        this.user = user;
    }
}

export class Query {
    group: Group;
    thread: Thread;

    constructor( group: Group, thread: Thread ){
        this.group = group;
        this.thread = thread;
    }
}
