import { Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    constructor( private _usersService: UsersService ) {}

    @Get()
    async findUser() {
        return await this._usersService.findUser();
    }

    @Post()
    async createUser() {
        return await this._usersService.createUser();
    }
}