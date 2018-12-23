import { Group } from './group.entity';
import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './../users/users.service';
import { UsersModule } from './../users/users.module';
import { MemberService } from 'members/member.service';
import { MemberModule } from 'members/member.module';

@Module({
    imports: [ TypeOrmModule.forFeature([Group]), UsersModule, MemberModule,
    ],
    controllers: [
        GroupController,
    ],
    providers: [
        GroupService, UsersService, MemberService,
    ],
})
export class GroupModule {}