import { QueryForAllUsersInGroup } from './../members/helpers/helpers';
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from './user.entity';
import { UserInfoDto } from './dto/user-info.dto';
import { Query, UserExistsQuery, QueryForUsersFromMembers, QueryById } from './helpers/helpers';
import { Member } from 'members/member.entity';
import { DirectMessageThread } from 'direct-message-thread/direct-message-thread.entity';
import { SettingsService } from 'settings/settings.service';

@Injectable()
export class UsersService {

  constructor(@InjectRepository(User)
    private readonly userRepository: Repository<User>,
              private _settingsService: SettingsService,
  ){}

  async checkIfUserExists( username: string, password: string ): Promise<boolean> {
    const query: UserExistsQuery = new UserExistsQuery( username, password );
    const result: any = await this.userRepository.findOne( query );
    return result ? true : false;
  }

  async getUser( username: string ): Promise<User> {
    const query: Query = new Query(username);
    return await this.userRepository.findOne(query);
  }

  async getUserById( userId: number ): Promise<User> {
    const query: QueryById = new QueryById( userId );

    return await this.userRepository.findOne( query );
  }

  async getUsers( usernames: string[] ): Promise<User[]> {
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
    const result: User = await this.getUser( userInfoDto.username );
    if ( !result ){
      const resultOfCreation: any = await this.userRepository.save(userInfoDto);
      const user: User = await this.getUser( userInfoDto.username );
      const createdSettings: any = await this._settingsService.initializeUserSettings( user );
      return user && createdSettings;
    }
    return false;
  }

  async getUsersByMembership( members: Member[] ): Promise<User[]> { // need to filter out user making request
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

  async findUsersWithNameLikeAndNotInUserIds( searchTerm: string, userIds: number[]  ): Promise<User[]> {
    return await this.userRepository
      .createQueryBuilder('User')
      .where('user.username LIKE :name AND user.id NOT IN (:...ids)', {name: '%' + searchTerm + '%', ids: userIds })
      .getMany();
  }

  async findUsersWithNameLikeAndInUserIds( searchTerm: string, userIds: number[] ): Promise<User[]> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.username LIKE :name', { name: searchTerm + '%'})
      .getMany();
  }

}