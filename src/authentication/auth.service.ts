
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import * as jwt from 'jsonwebtoken';
import { User } from 'users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  signIn( user: User ){
    const userToken: JwtPayload = { username: user.username };
    const secretOrKey = 'secretKey';
    const token = jwt.sign(userToken, secretOrKey);
    const id: number = user.id;
    return { token, id };
  }

  async validateUser(payload: JwtPayload): Promise<any> {
    return await this.usersService.findUser(payload.username);
  }
}