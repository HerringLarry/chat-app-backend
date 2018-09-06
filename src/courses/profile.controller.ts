import { Controller, Get } from '@nestjs/common';
import { ProfileService } from './profile.service';

@Controller('profile')
export class CoursesController {

    constructor( private _profileService: ProfileService ) {}

    @Get()
    async findAll() {
        return await this._profileService.findAll();
    }
}