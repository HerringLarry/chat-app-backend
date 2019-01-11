import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { DirectMessageThreadService } from './direct-message-thread.service';
import { DMThreadCreationDto } from './dto/direct-message-thread-creation.dto';

@Controller('directmessagethread')
export class DirectMessageThreadController {

    constructor( private _threadService: DirectMessageThreadService ) {}

    @Get('/:threadId')
    async getDirectMessageThread(@Param('threadId') threadId: number) {
        return await this._threadService.getThread( threadId );
    }

    @Get('/:groupName/:username')
    async getAllDirectMessageThreadsAssociatedWithGroup(@Param('groupName') groupName: string, @Param('username') username: string) {
        return await this._threadService.getAllThreadsAssociatedWithGroupAndUser(username, groupName);
    }

    @Post()
    async createDirectMessageThread(@Body() threadCreationDto: DMThreadCreationDto) {
        return await this._threadService.createDirectMessageThread( threadCreationDto );
    }
}