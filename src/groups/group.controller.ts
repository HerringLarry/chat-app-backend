import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupCreationDto } from './dto/group-creation.dto';

@Controller('groups')
export class GroupController {

    constructor( private _groupService: GroupService ) {}

    @Get('/:groupName')
    async getGroup(@Param('groupName') groupName: string) {
        return await this._groupService.getGroup( groupName );
    }

    @Post()
    async createGroup(@Body() groupCreationDto: GroupCreationDto) {
        return await this._groupService.createGroup( groupCreationDto );
    }

    @Get('/getUserGroups/:username')
    async getAllGroupsAssociatedWithUser(@Param('username') username: string) {
        return await this._groupService.findAllGroupsWithUser( username );
    }
}