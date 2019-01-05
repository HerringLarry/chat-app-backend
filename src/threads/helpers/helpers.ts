import {  ThreadCreationDto } from '../dto/thread-creation.dto';
import { Group } from 'groups/group.entity';

export class ThreadObject {
    name: string;
    groupId: number;
    isDirect: boolean;
    constructor( threadCreationDto: ThreadCreationDto, group: Group​​ ){
        this.name = threadCreationDto.name;
        this.groupId = group.id;
        this.isDirect = false;
    }
}

export class Query {
    id: number;
    groupId: number;
    constructor( id: number, group: Group ){
        this.id = id;
        this.groupId = group.id;
    }
}

export class QueryForThreadsAssociatedWithGroup {
    groupId: number;
    constructor( group: Group ){
        this.groupId = group.id;
    }
}

export class QueryWithName {
    name: string;
    groupId: number;
    constructor( name: string, groupId: number ){
        this.name = name;
        this.groupId = groupId;
    }
}
