import { DirectMessagesGateway } from './direct-messages.gateway';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupModule } from 'groups/group.module';
import { DirectMessageService } from './direct-message.service';
import { DirectMessageController } from './direct-message.controller';
import { DirectMessage } from './direct-message.entity';
import { ThreadService } from 'threads/thread.service';
import { GroupService } from 'groups/group.service';
import { DirectMessageThreadService } from 'direct-message-thread/direct-message-thread.service';
import { DirectMessageThreadModule } from 'direct-message-thread/direct-message-thread.module';
import { MessageModule } from 'messages/message.module';
import { MessageService } from 'messages/message.service';

@Module({
    imports: [ TypeOrmModule.forFeature([DirectMessage]), GroupModule, DirectMessageThreadModule, UsersModule,
    ],
    controllers: [
        DirectMessageController,
    ],
    providers: [
        DirectMessageService, DirectMessageThreadService, GroupService, UsersService, DirectMessagesGateway,
    ],
})
export class DirectMessageModule {}