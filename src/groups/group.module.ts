import { Group } from './group.entity';
import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [ TypeOrmModule.forFeature([Group]),
    ],
    controllers: [
        GroupController,
    ],
    providers: [
        GroupService,
    ],
})
export class GroupModule {}