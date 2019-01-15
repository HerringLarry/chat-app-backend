import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageCreationDto } from './dto/message-creation.dto';

@Controller('message')
export class MessageController {

    constructor( private _messageService: MessageService ) {}

    @Post()
    async createMessage(@Body() messageCreationDto: MessageCreationDto​​) {
        await this._messageService.createMessage( messageCreationDto );
    }

    @Get('/:groupName/:threadName')
    async getThreadsMessages(@Param('groupName') groupName: string, @Param('threadName') threadName: string) {
        return await this._messageService.getMessages( groupName, threadName);
    }

    @Get('notifications/:groupId/:userId')
    async getUserNotifications( @Param('groupId') groupId: number, @Param('userId') userId: number ) {
        return await this._messageService.getNotifications( userId, groupId );
    }
}