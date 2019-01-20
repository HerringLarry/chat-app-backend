import { Notifications } from './notifications.entity';
import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { MemberService } from 'members/member.service';
import { MemberModule } from 'members/member.module';
import { PassportModule } from '@nestjs/passport';
import { MessageService } from 'messages/message.service';
import { MessageModule } from 'messages/message.module';
import { NotificationsGateway } from './notifications.gateway';
import { GroupService } from 'groups/group.service';
import { GroupModule } from 'groups/group.module';
import { DirectMessageModule } from 'direct-messages/direct-message.module';
import { DirectMessageService } from 'direct-messages/direct-message.service';

@Module({
    imports: [ MessageModule, GroupModule, UsersModule, DirectMessageModule,
    ],
    providers: [
        NotificationsService, MessageService, NotificationsGateway, GroupService, UsersService, DirectMessageService,
    ],
    exports: [
        NotificationsService,
    ],
})
export class NotificationsModule {}