import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {

  async findAll(): Promise<string> {
    return 'hello';
  }
}