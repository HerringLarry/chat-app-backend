import { Controller, Get, Post, Body, Param, Put, UseGuards, Headers } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupCreationDto } from './dto/group-creation.dto';
import { AuthGuard } from '@nestjs/passport';

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
    async getAllGroupsAssociatedWithUser(@Param('username') username: string, @Headers() headers: any) {
        return await this._groupService.getAllGroupsWithUser( username );
    }

    @Get('/:username/:group')
    async getUsersInGroup(@Param('username') username: string, @Param('group') groupName: string){
        return await this._groupService.getAllUsersInGroup( username, groupName);
    }
}