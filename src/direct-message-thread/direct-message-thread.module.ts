import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupModule } from 'groups/group.module';
import { DirectMessageThreadService } from './direct-message-thread.service';
import { GroupService } from 'groups/group.service';
import { DirectMessageThread } from './direct-message-thread.entity';

@Module({
    imports: [ TypeOrmModule.forFeature([DirectMessageThread]), GroupModule,
    ],
    controllers: [
        DirectMessageThreadService,
    ],
    providers: [
        DirectMessageThreadService, GroupService,
    ],
})
export class ThreadModule {}