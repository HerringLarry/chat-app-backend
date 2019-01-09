import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UserInfoDto } from 'users/dto/user-info.dto';

@Controller('auth')
export class AuthController {

    constructor( private _usersService: UsersService, private _authService: AuthService ) {}

    @Post()
    async createUser(@Body() registrationFormDto: UserInfoDto) {
        await this._usersService.createUser( registrationFormDto );
    }

    @Get('/:username/:password')
    async signIn(@Param('username') username: string, @Param('password') password: string ) {
        const result: boolean = await this._usersService.checkIfUserExists( username, password );
        if ( result ) {
            return this._authService.signIn( username );
        }
    }
}