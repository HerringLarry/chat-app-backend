import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupCreationDto } from './dto/group-creation.dto';

@Controller('groups')
export class GroupController {

    constructor( private _threadService: GroupService ) {}

    @Get('/:groupName')
    async getGroup(@Param('groupName') groupName: string) {
        return await this._threadService.getGroup( groupName );
    }

    @Post()
    async createGroup(@Body() groupCreationDto: GroupCreationDto) {
        await this._threadService.createGroup( groupCreationDto );
    }
}