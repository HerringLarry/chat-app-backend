import { QueryForAllUsersInGroup } from './../members/helpers/helpers';
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from './user.entity';
import { UserInfoDto } from './dto/user-info.dto';
import { Query, UserExistsQuery, QueryForUsersFromMembers, QueryById } from './helpers/helpers';
import { Member } from 'members/member.entity';
import { DirectMessageThread } from 'direct-message-thread/direct-message-thread.entity';

@Injectable()
export class UsersService {

  constructor(@InjectRepository(User)
  private readonly userRepository: Repository<User> ){}

  async checkIfUserExists( username: string, password: string ): Promise<boolean> {
    const query: UserExistsQuery = new UserExistsQuery( username, password );
    const result: any = await this.userRepository.findOne( query );
    return result ? true : false;
  }

  async findUser( username: string ): Promise<User> {
    const query: Query = new Query(username);
    return await this.userRepository.findOne(query);
  }

  async findUserById( userId: number ): Promise<User> {
    const query: QueryById = new QueryById( userId );

    return await this.userRepository.findOne( query );
  }

  async findUsers( usernames: string[] ): Promise<User[]> {
    const users: User[] = await this.userRepository.find({
      where: {username: In(usernames)},
    });
    if ( users.length > 0) {
      return  users;
    } else {
      return [];
    }
  }

  async createUser( userInfoDto: UserInfoDto ): Promise<boolean> {
    const result: User = await this.findUser( userInfoDto.username );
    if ( !result ){
      return await this.userRepository.save(userInfoDto) ? true : false;
    }
  }

  async findUsersByMembership( members: Member[] ): Promise<User[]> { // need to filter out user making request
    const queryForUsersFromMembers: QueryForUsersFromMembers = new QueryForUsersFromMembers( members );
    const users: User[] = await this.userRepository.find({
      where: {id: In(queryForUsersFromMembers.userIds)},
    });

    if ( users.length > 0 ) {
      return users;
    } else {
      return [];
    }
  }

  async getAllUsersInIds( DMThread: DirectMessageThread ): Promise<User[]> {

    return await this.userRepository.find({
        where: {id: In(DMThread.userIds)},
    });
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

}