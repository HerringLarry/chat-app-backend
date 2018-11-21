import {  ThreadCreationDto } from '../dto/thread-creation.dto';
import { Group } from 'groups/group.entity';

export class ThreadObject {
    name: string;
    groupId: number;
    constructor( threadCreationDto: ThreadCreationDto, group: Group​​ ){
        this.name = threadCreationDto.name;
        this.groupId = group.id;
    }
}

export class Query {
    name: string;
    groupId: number;
    constructor( name: string, group: Group ){
        this.name = name;
        this.groupId = group.id;
    }
}

export class QueryForThreadsAssociatedWithGroup {
    groupId: number;
    constructor( group: Group ){
        this.groupId = group.id;
    }
}
