import { Member } from './member.entity';
import { Module } from '@nestjs/common';
import { MemberService as MemberService } from './member.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { GroupModule } from 'groups/group.module';
import { GroupService } from 'groups/group.service';
import { MemberController } from './member.controller';

@Module({
    imports: [ TypeOrmModule.forFeature([Member]), UsersModule,
    ],
    controllers: [
        MemberController,
    ],
    providers: [
        MemberService, UsersService,
    ],
    exports: [
        MemberService,
    ],
})
export class MemberModule {}