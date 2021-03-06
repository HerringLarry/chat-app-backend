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
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

  saltRounds = 10;

  constructor(@InjectRepository(User)
    private readonly userRepository: Repository<User>,
              private _settingsService: SettingsService,
  ){}

  async checkIfUserExists( username: string, password: string ): Promise<boolean> {
    const user = await this.getUser( username );
    if ( user ) {
      return await this.compareHash( password, user.password );
    }
    return false;
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

  async compareHash(password: string|undefined, hash: string|undefined): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async createUser( userInfoDto: UserInfoDto ): Promise<boolean> {
    const result: User = await this.getUser( userInfoDto.username );
    if ( !result ){
      const hashedPassword = await this.getHash( userInfoDto.password );
      userInfoDto.password = hashedPassword;
      const resultOfCreation: any = await this.userRepository.save(userInfoDto);
      const user: User = await this.getUser( userInfoDto.username );
      const createdSettings: any = await this._settingsService.initializeUserSettings( user );
      return user && createdSettings;
    }
    return false;
  }

  async getHash(password: string|undefined): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
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
    const sqlWhereConditions = '( user.username LIKE :name Or user.firstName LIKE :name OR user.lastName LIKE :name ) AND user.id NOT IN (:...ids)';
    return await this.userRepository
      .createQueryBuilder('user')
      .where(sqlWhereConditions, {name: searchTerm + '%', ids: userIds })
      .getMany();
  }

  async findUsersWithNameLikeAndInUserIds( searchTerm: string, userIds: number[] ): Promise<User[]> {
    const sqlWhereConditions = '( user.username LIKE :name Or user.firstName LIKE :name OR user.lastName LIKE :name ) AND user.id IN (:...ids)';
    return await this.userRepository
      .createQueryBuilder('user')
      .where(sqlWhereConditions, { name: searchTerm + '%', ids: userIds})
      .getMany();
  }

  async addProfilePhotoPath( userId: number, path: string ): Promise<void> {
    const user: User = await this.getUserById(userId);
    user.photoPath = String(path);
    await this.userRepository.save( user );
  }

  async getProfilePhotoPath( userId: number ): Promise<string> {
    const user: User = await this.getUserById( userId );

    return user.photoPath;
  }

  async updateUserById( userId: number, updatedUser: User ): Promise<any> {
    const user: User = await this.getUserById( userId );
    const userToBeSaved = this.updateUser( user, updatedUser );

    return await this.userRepository.save( userToBeSaved );
  }

  private updateUser( user: User, updatedUser: User ): User {
    user.username = updatedUser.username;
    user.firstName = updatedUser.firstName;
    user.lastName = updatedUser.lastName;
    user.email = updatedUser.email;
    user.mobile = updatedUser.mobile;

    return user;
  }

}