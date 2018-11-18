import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupModule } from 'groups/group.module';
import { ThreadService } from './thread.service';
import { GroupService } from 'groups/group.service';
import { ThreadController } from './thread.controller';
import { Thread } from './thread.entity';

@Module({
    imports: [ TypeOrmModule.forFeature([Thread]), GroupModule,
    ],
    controllers: [
        ThreadController,
    ],
    providers: [
        ThreadService, GroupService,
    ],
})
export class ThreadModule {}