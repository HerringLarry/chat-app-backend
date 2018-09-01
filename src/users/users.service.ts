import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {

  constructor(@InjectRepository(User)
  private readonly userRepository: Repository<User> ){}

  async findUser(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async createUser(): Promise<void> {
    const user = new User​​();
    user.firstName = 'will';
    user.username = 'he';
    user.lastName = 'hello';
    user.email = 'ehe';
    user.mobile = '123123';
    user.courses = [];
    await this.userRepository.save(user);
  }
}