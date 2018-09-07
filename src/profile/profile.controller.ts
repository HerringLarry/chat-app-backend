import { Controller, Get, Body } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileDto } from './dto/profile.dto';

@Controller('profile')
export class ProfileController {

    constructor( private _profileService: ProfileService ) {}

    @Get()
    async createProfile(@Body() profileDto: ProfileDto) {
        return await this._profileService.createProfile(profileDto);
    }
}