import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserInfoDto } from './dto/user-info.dto';

@Controller('users')
export class UsersController {

    constructor( private _usersService: UsersService ) {}

    @Get('/:username')
    async findUser(@Param('username') username: string ) {
        return await this._usersService.findUser( username );
    }

    @Post()
    async createUser(@Body() userInfoDto: UserInfoDto) {
        return await this._usersService.createUser( userInfoDto );
    }
}