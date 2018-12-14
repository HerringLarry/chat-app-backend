import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { DirectMessageThreadService } from './thread.service';
import { ThreadCreationDto } from './dto/thread-creation.dto';

@Controller('directmessagethread')
export class DirectMessageThreadController {

    constructor( private _threadService: DirectMessageThreadService ) {}

    @Get('/:threadName/:groupName')
    async getDirectMessageThread(@Param('threadName') threadName: string, @Param('groupName') groupName: string) {
        return await this._threadService.getThread( threadName, groupName );
    }

    @Get('/:groupName')
    async getAllDirectMessageThreadsAssociatedWithGroup(@Param('groupName') groupName: string) {
        return await this._threadService.getAllThreadsAssociatedWithGroup(groupName);
    }

    @Post()
    async createDirectMessageThread(@Body() threadCreationDto: ThreadCreationDto​​) {
        await this._threadService.createThread( threadCreationDto );
    }
}