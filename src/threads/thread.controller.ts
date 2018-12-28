import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { ThreadService } from './thread.service';
import { ThreadCreationDto } from './dto/thread-creation.dto';

@Controller('thread')
export class ThreadController {

    constructor( private _threadService: ThreadService ) {}

    @Get('/:threadName/:groupName')
    async getThread(@Param('threadName') threadName: string, @Param('groupName') groupName: string) {
        return await this._threadService.getThread( threadName, groupName );
    }

    @Get('/getThreads/:groupName/:username')
    async getAllThreadsAssociatedWithGroup(@Param('groupName') groupName: string, @Param('username') username: string) {
        return await this._threadService.getAllThreadsAssociatedWithMember(groupName, username);
    }

    @Post()
    async createThread(@Body() threadCreationDto: ThreadCreationDto​​) {
        await this._threadService.createThread( threadCreationDto );
    }
}