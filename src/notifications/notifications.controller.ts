import { Controller, Get, Post, Body, Param, Put, UseGuards, Headers } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotificationsService } from './notifications.service';
import { Notifications } from './notifications.entity';
import { SettingsDto } from './dto/settings.dto';

@Controller('notifications')
export class NotificationsController {

    constructor( private _notificationsService: NotificationsService ) {}

   @Get('/:userId')
   async getUserSettings( @Param('userId') userId: number ): Promise<Notifications> {

       return await this._notificationsService.getUserSettings( userId );
   }

   @Put()
   async updateUserSettings( @Body() settingsDto: SettingsDto ): Promise<void> {

       await this._notificationsService.updateUserSettings( settingsDto );
   }
}