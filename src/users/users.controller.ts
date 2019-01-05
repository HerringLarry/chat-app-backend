import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserInfoDto } from './dto/user-info.dto';

@Controller('users')
export class UsersController {

    constructor( private _usersService: UsersService ) {}

    @Get('/:username/:password')
    async checkIfUserExists(@Param('username') username: string, @Param('password') password: string ) {
        return await this._usersService.checkIfUserExists( username, password );
    }

    @Post()
    async createUser(@Body() registrationFormDto: UserInfoDto) {
        await this._usersService.createUser( registrationFormDto );
    }

    @Get('/getAllUsers')
    async getAllUsers() {
        return await this._usersService.getAllUsers();
    }
}
