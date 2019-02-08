import { Controller, Get, Post, Body, Param, Put, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserInfoDto } from './dto/user-info.dto';
import { User } from './user.entity';

@Controller('users')
export class UsersController {

    constructor( private _usersService: UsersService ) {}

    @Get('/:username/:password')
    async checkIfUserExists(@Param('username') username: string, @Param('password') password: string ) {

        return await this._usersService.checkIfUserExists( username, password );
    }

    @Get('/getAllUsers')
    async getAllUsers() {

        return await this._usersService.getAllUsers();
    }

    @Get('/:userId')
    async getUserById( @Param('userId') userId: number ) {
        return await this._usersService.getUserById( userId );
    }

    @Put('/:userId')
    async updateUserById( @Param('userId') userId, @Body() user: User){
        return await this._usersService.updateUserById( userId, user );
    }
}
