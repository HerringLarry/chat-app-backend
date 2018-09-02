import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserInfoDto } from './dto/user-info.dto';
import { Query } from './helpers/helpers';

@Injectable()
export class UsersService {

  constructor(@InjectRepository(User)
  private readonly userRepository: Repository<User> ){}

  async findUser( username: string ): Promise<User> {
    const query: Query = new Query(username);
    return await this.userRepository.findOne(query);
  }

  async createUser( userInfoDto: UserInfoDto ): Promise<void> {
    const result: User = await this.findUser( userInfoDto.username );
    if ( !result ){
      await this.userRepository.save(userInfoDto);
    }
  }
}