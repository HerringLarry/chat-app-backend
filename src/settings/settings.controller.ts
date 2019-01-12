import { Controller, Get, Post, Body, Param, Put, UseGuards, Headers } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SettingsService } from './settings.service';
import { Settings } from './settings.entity';
import { SettingsDto } from './dto/settings.dto';

@Controller('settings')
export class SettingsController {

    constructor( private _settingsService: SettingsService ) {}

   @Get('/:userId')
   async getUserSettings( @Param('username') userId: number ): Promise<Settings> {
       return await this._settingsService.getUserSettings( userId );
   }

   @Put()
   async updateUserSettings( @Body() settingsDto: SettingsDto ): Promise<void> {
       await this._settingsService.updateUserSettings( settingsDto );
   }
}