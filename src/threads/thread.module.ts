import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupModule } from 'groups/group.module';
import { ThreadService } from './thread.service';
import { GroupService } from 'groups/group.service';
import { ThreadController } from './thread.controller';
import { Thread } from './thread.entity';
import { UsersService } from 'users/users.service';
import { UsersModule } from 'users/users.module';
import { MemberModule } from 'members/member.module';
import { MemberService } from 'members/member.service';
import { NotificationsModule } from 'notifications/notifications.module';
import { NotificationsService } from 'notifications/notifications.service';

@Module({
    imports: [ TypeOrmModule.forFeature([Thread]), GroupModule, UsersModule, MemberModule,
    ],
    controllers: [
        ThreadController,
    ],
    providers: [
        ThreadService, GroupService, UsersService, MemberService,
    ],
    exports: [
        ThreadService,
    ],
})
export class ThreadModule {}