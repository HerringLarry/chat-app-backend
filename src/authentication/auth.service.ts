
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  signIn( usern: string ){
    const user: JwtPayload = { username: usern };
    const secretOrKey = 'secretKey';
    const token = jwt.sign(user, secretOrKey);
    return { token };
  }

  async validateUser(payload: JwtPayload): Promise<any> {
    return await this.usersService.findUser(payload.username);
  }
}