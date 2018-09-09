import { Req, Res, Injectable } from '@nestjs/common';
import { Profile } from './profile.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileDto } from './dto/profile.dto';
import { User } from 'users/user.entity';
import { UserQuery } from './structures/helpers';

@Injectable()
export class ProfileService {
  constructor( @InjectRepository(Profile) private readonly profileRepository: Repository<Profile>,
               @InjectRepository(User) private readonly userRepository: Repository<User>  ) {}

  async createProfile( profileDto: ProfileDto): Promise<void> {
    const profile: Profile = this.createProfileObject( profileDto );
    await this.profileRepository.save( profile );
    await this.updateUser( profile, profileDto.username );
  }

  async updateUser( profile: Profile, username: string ): Promise<Profile> {
    const userQuery: UserQuery = new UserQuery( username );
    const user: User = await this.userRepository.findOne(userQuery);
    user.profile = profile;
    await this.userRepository.save(user);
    return profile;
  }

  createProfileObject( profileDto: ProfileDto ): Profile​​ {
    const profile: Profile = new Profile();
    profile.bio = profileDto.bio;
    profile.interests = profileDto.interests;
    return profile;
  }

  async createReference( @Req() req ): Promise<void> {

  }
}