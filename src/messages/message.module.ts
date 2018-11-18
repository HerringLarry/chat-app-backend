import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupModule } from 'groups/group.module';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { Message } from './message.entity';
import { ThreadService } from 'threads/thread.service';
import { GroupService } from 'groups/group.service';
import { ThreadModule } from 'threads/thread.module';

@Module({
    imports: [ TypeOrmModule.forFeature([Message]), GroupModule, ThreadModule,
    ],
    controllers: [
        MessageController,
    ],
    providers: [
        MessageService, ThreadService, GroupService,
    ],
})
export class MessageModule {}