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

@Module({
    imports: [ TypeOrmModule.forFeature([Notifications]), MessageModule,
    ],
    controllers: [
        NotificationsController,
    ],
    providers: [
        NotificationsService,
    ],
    exports: [
        NotificationsService, MessageService,
    ],
})
export class NotificationsModule {}