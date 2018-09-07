import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { ProfileService } from 'profile/profile.service';
import { RegistrationDto } from './dto/registration.dto';

@Controller('users')
export class UsersController {

    constructor( private _usersService: UsersService, private _profileService: ProfileService ) {}

    @Get('/:username/:password')
    async CheckIfUserExists(@Param('username') username: string, @Param('password') password: string ) {
        return await this._usersService.checkIfUserExists( username, password );
    }

    @Post()
    async createUserAndProfile(@Body() registrationDto: RegistrationDto) {
        await this._usersService.createUser( registrationDto.registrationFormDto );
        await this._profileService.createProfile( registrationDto.profileFormDto );
    }
}