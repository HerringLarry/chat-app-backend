import { Req, Res, Injectable } from '@nestjs/common';
import { Profile } from './profile.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileDto } from './dto/profile.dto';
import { User } from 'users/user.entity';
import { UserQuery, ProfileQuery } from './structures/helpers';
import * as multer from 'multer';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';
import { extname } from 'path';

const AWS_S3_BUCKET_NAME = 'artapps3bucket';
AWS.config.loadFromPath('./aws/AwsConfig.json');
const s3 = new AWS.S3();

@Injectable()
export class ProfileService {
  constructor( @InjectRepository(Profile) private readonly profileRepository: Repository<Profile>,
               @InjectRepository(User) private readonly userRepository: Repository<User>  ) {}

  async createProfile( profileDto: ProfileDto): Promise<void> {
    let profile: Profile = this.createProfileObject( profileDto );
    profile = await this.profileRepository.save( profile );
    await this.updateUserAndDeleteFormerProfileIfExists( profile, profileDto.username );
  }

  async updateUserAndDeleteFormerProfileIfExists( profile: Profile, username: string ): Promise<void> {
    const userQuery: UserQuery = new UserQuery( username );
    const user: User = await this.userRepository.findOne(userQuery);
    const formerId: number = user.profileId;
    user.profileId = profile.id;
    await this.userRepository.save(user);
    await this.deleteFormerProfileIfExists( formerId );
  }

  async deleteFormerProfileIfExists( id: number ): Promise<void> {
    const profileQuery: ProfileQuery = new ProfileQuery( id );
    const profile: Profile = await this.profileRepository.findOne( profileQuery );
    if (profile) {
      await this.profileRepository.remove( profile );
    }
  }

  createProfileObject( profileDto: ProfileDto ): Profile {
    const profile: Profile = new Profile();
    profile.bio = profileDto.bio;
    profile.interests = profileDto.interests;
    profile.username = profileDto.username;
    return profile;
  }

  async createReference( fileName: string, username: string ): Promise<boolean> {
    const profile: Profile = await this.checkIfUserExistsAndReturnRelevantProfile( username );
    if ( profile ) {
      profile.profilePhoto = fileName;
      await this.profileRepository.save( profile );
      return true;
    }
    return false;
  }

  async checkIfUserExistsAndReturnRelevantProfile( username: string ): Promise<Profile> {
    const userQuery: UserQuery = new UserQuery( username );
    const user: User = await this.userRepository.findOne( userQuery );
    const profileQuery: ProfileQuery = new ProfileQuery( user.profileId );
    return await this.profileRepository.findOne( profileQuery );
  }

  async uploadProfileImage( @Req() req, username: string ): Promise<void> {
    const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
    const fileName = `${randomName}${extname(req.file.originalname)}`;
    const params = {
      Body: req.file.buffer,
      Bucket: AWS_S3_BUCKET_NAME,
      Key: 'profile-photos/' + fileName,
    };
    const shouldUploadFile = await this.createReference( fileName, username );
    if ( shouldUploadFile ){
      return await s3
      .putObject(params)
      .promise()
      .then(
        data => {
          return;
        },
        err => {
          return err;
        });
       } else {
      return;
    }
  }
}