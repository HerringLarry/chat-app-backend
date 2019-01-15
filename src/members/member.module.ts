import { Member } from './member.entity';
import { Module } from '@nestjs/common';
import { MemberService as MemberService } from './member.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { GroupModule } from 'groups/group.module';
import { GroupService } from 'groups/group.service';
import { NotificationsModule } from 'notifications/notifications.module';
import { NotificationsService } from 'notifications/notifications.service';

@Module({
    imports: [ TypeOrmModule.forFeature([Member]), UsersModule, NotificationsModule,
    ],
    providers: [
        MemberService, UsersService, NotificationsService,
    ],
    exports: [
        MemberService,
    ],
})
export class MemberModule {}