import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor( private _usersService: UsersService, private _authService: AuthService ) {}

    @Get('/:username/:password')
    async signIn(@Param('username') username: string, @Param('password') password: string ) {
        const result: boolean = await this._usersService.checkIfUserExists( username, password );
        if ( result ) {
            return this._authService.signIn( username );
        }
    }
}