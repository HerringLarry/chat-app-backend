import { Invite } from './invites.entity';
import { Module } from '@nestjs/common';
import { InvitesService } from './invites.service';
import { InvitesController } from './invites.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from 'users/users.service';
import { UsersModule } from 'users/users.module';
import { GroupModule } from 'groups/group.module';
import { GroupService } from 'groups/group.service';
import { MemberModule } from 'members/member.module';
import { MemberService } from 'members/member.service';
import { ThreadModule } from 'threads/thread.module';
import { ThreadService } from 'threads/thread.service';

@Module({
    imports: [ TypeOrmModule.forFeature([Invite]), UsersModule, GroupModule, MemberModule, ThreadModule,
    ],
    controllers: [
        InvitesController,
    ],
    providers: [
        InvitesService, UsersService, GroupService, MemberService, ThreadService,
    ],
    exports: [
        InvitesService,
    ],
})
export class InvitesModule {}