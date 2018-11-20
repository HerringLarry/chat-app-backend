import { Group } from './group.entity';
import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './../users/users.service';
import { UsersModule } from './../users/users.module';

@Module({
    imports: [ TypeOrmModule.forFeature([Group]), UsersModule,
    ],
    controllers: [
        GroupController,
    ],
    providers: [
        GroupService, UsersService,
    ],
})
export class GroupModule {}