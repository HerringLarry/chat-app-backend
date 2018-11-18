import {  ThreadCreationDto } from '../dto/thread-creation.dto';
import { Group } from 'groups/group.entity';

export class ThreadObject {
    name: string;
    group: Group;
    constructor( threadCreationDto: ThreadCreationDto, group: Group​​ ){
        this.name = threadCreationDto.name;
        this.group = group;
    }
}

export class Query {
    name: string;
    group: Group;
    constructor( name: string, group: Group ){
        this.name = name;
        this.group = group;
    }
}
