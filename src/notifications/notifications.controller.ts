import { Controller, Get, Post, Body, Param, Put, UseGuards, Headers } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotificationsService } from './notifications.service';
import { Notifications } from './notifications.entity';
import { SettingsDto } from './dto/settings.dto';

@Controller('notifications')
export class NotificationsController {

    constructor( private _notificationsService: NotificationsService ) {}

   @Get('/:userId/:groupId')
   async getUserSettings( @Param('userId') userId: number, @Param('groupId') groupId: number ): Promise<Notifications[]> {

       return await this._notificationsService.getAllNotificationsForUserInGroup( userId, groupId );
   }
}