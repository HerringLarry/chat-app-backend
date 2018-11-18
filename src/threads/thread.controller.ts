import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { ThreadService } from './thread.service';
import { ThreadCreationDto } from './dto/thread-creation.dto';

@Controller('thread')
export class ThreadController {

    constructor( private _threadService: ThreadService ) {}

    @Get('/:threadName')
    async getGroup(@Param('threadName') threadName: string, @Param('groupName') groupName: string) {
        return await this._threadService.getThread( threadName, groupName );
    }

    @Post()
    async createGroup(@Body() threadCreationDto: ThreadCreationDto​​) {
        await this._threadService.createThread( threadCreationDto );
    }
}