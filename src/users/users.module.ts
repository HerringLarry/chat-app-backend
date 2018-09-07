import { ProfileModule } from './../profile/profile.module';
import { User } from './user.entity';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileService } from 'profile/profile.service';

@Module({
    imports: [ TypeOrmModule.forFeature([User]), ProfileModule,
    ],
    controllers: [
        UsersController,
    ],
    providers: [
        UsersService, ProfileService,
    ],
})
export class UsersModule {}