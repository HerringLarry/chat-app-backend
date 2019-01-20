import { DirectMessageThreadController } from './direct-message-thread.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupModule } from 'groups/group.module';
import { DirectMessageThreadService } from './direct-message-thread.service';
import { GroupService } from 'groups/group.service';
import { DirectMessageThread } from './direct-message-thread.entity';
import { UsersModule } from 'users/users.module';
import { UsersService } from 'users/users.service';

@Module({
    imports: [ TypeOrmModule.forFeature([DirectMessageThread]), GroupModule, UsersModule,
    ],
    controllers: [
        DirectMessageThreadController,
    ],
    providers: [
        DirectMessageThreadService, GroupService, UsersService,
    ],
    exports: [
        DirectMessageThreadService,
    ],
})
export class DirectMessageThreadModule {}