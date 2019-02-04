import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { DirectMessageService } from './direct-message.service';
import { DirectMessageCreationDto } from './dto/direct-message-creation.dto';

@Controller('directmessage')
export class DirectMessageController {

    constructor( private _directMessageService: DirectMessageService ) {}

    @Post()
    async createMessage(@Body() messageCreationDto: DirectMessageCreationDto) {
        await this._directMessageService.createMessage( messageCreationDto );
    }

    @Get('/:groupName/:threadId')
    async getThreadsMessages(@Param('groupName') groupName: string, @Param('threadId') threadId: number) {
        return await this._directMessageService.getMessages( groupName, threadId );
    }

    @Get('getMessages/:groupName/:threadId/:skipValue')
    async getLastThirtyMessages( @Param('groupName') groupName: string, @Param('threadId') threadId: number, @Param('skipValue') skipValue: number ) {
        return await this._directMessageService.getThirtyMessages( groupName, threadId, skipValue );
    }
}