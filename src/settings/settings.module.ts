import { Settings } from './settings.entity';
import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { MemberService } from 'members/member.service';
import { MemberModule } from 'members/member.module';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [ TypeOrmModule.forFeature([Settings]), UsersModule, MemberModule,
    ],
    controllers: [
        SettingsController,
    ],
    providers: [
        SettingsService, UsersService, MemberService,
    ],
    exports: [
        SettingsService,
    ],
})
export class SettingsModule {}