import { Module } from '@nestjs/common';
import {ProfilePhotoService } from './profile-photo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { MemberService } from 'members/member.service';
import { MemberModule } from 'members/member.module';
import { PassportModule } from '@nestjs/passport';
import { ProfilePhotoController } from './profile-photo.controller';

@Module({
    imports: [
        UsersModule,
    ],
    controllers: [ ProfilePhotoController,
    ],
    providers: [
        ProfilePhotoService, UsersService,
    ],
    exports: [
        ProfilePhotoService,
    ],
})
export class ProfilePhotoModule {}
