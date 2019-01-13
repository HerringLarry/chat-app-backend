import { User } from './user.entity';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsModule } from 'settings/settings.module';
import { SettingsService } from 'settings/settings.service';

@Module({
    imports: [ TypeOrmModule.forFeature([User]), SettingsModule,
    ],
    controllers: [
        UsersController,
    ],
    providers: [
        UsersService, SettingsService,
    ],
    exports: [
        UsersService,
    ],
})
export class UsersModule {}