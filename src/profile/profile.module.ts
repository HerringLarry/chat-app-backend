import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './profile.entity';
import { User } from 'users/user.entity';

@Module({
    imports: [ TypeOrmModule.forFeature([Profile]), TypeOrmModule.forFeature([User]),
    ],
    controllers: [
        ProfileController,
    ],
    providers: [
        ProfileService,
    ],
    exports: [
        ProfileService,
    ],
})
export class ProfileModule {}