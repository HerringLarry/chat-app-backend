import { GroupCreationDto } from './../dto/group-creation.dto';
export class GroupObject {
    name: string;
    constructor( groupCreationDto: GroupCreationDto ){
        this.name = groupCreationDto.name;
    }
}

export class Query {
    name: string;
    constructor( name: string ){
        this.name = name;
    }
}
