import { MessagesGateway } from './messages.gateway';
import { UsersService } from './../users/users.service';
import { UsersModule } from './../users/users.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupModule } from 'groups/group.module';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { Message } from './message.entity';
import { ThreadService } from 'threads/thread.service';
import { GroupService } from 'groups/group.service';
import { ThreadModule } from 'threads/thread.module';
import { MemberModule } from 'members/member.module';

@Module({
    imports: [ TypeOrmModule.forFeature([Message]), GroupModule, ThreadModule, UsersModule, MemberModule,
    ],
    controllers: [
        MessageController,
    ],
    providers: [
        MessageService, ThreadService, GroupService, UsersService, MessagesGateway,
    ],
})
export class MessageModule {}