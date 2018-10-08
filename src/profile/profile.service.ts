import { Req, Res, Injectable } from '@nestjs/common';
import { Profile } from './profile.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileDto } from './dto/profile.dto';
import { User } from 'users/user.entity';
import { UserQuery } from './structures/helpers';
import * as AWS from 'aws-sdk';
import { extname } from 'path';

const AWS_S3_BUCKET_NAME = 'artapps3';
const accessKey = process.env.ACCESS_KEY_ID;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;
const config = {
  accessKeyId: accessKey,
  secretAccessKey: secretAccessKey,
};
AWS.config.update(config);
const s3 = new AWS.S3();

@Injectable()
export class ProfileService {
  constructor( @InjectRepository(Profile) private readonly profileRepository: Repository<Profile>,
               @InjectRepository(User) private readonly userRepository: Repository<User>  ) {}

  async createProfile( profileDto: ProfileDto): Promise<void> {
    const profile: Profile = this.createProfileObject( profileDto );
    const username: string = profileDto.username;
    await this.profileRepository.save( profile );
    await this.updateUserAndDeleteFormerProfileIfExists( profile, username );
  }

  async updateUserAndDeleteFormerProfileIfExists( profile: Profile, username: string ): Promise<void> {
    const userQuery: UserQuery = new UserQuery( username );
    const user: User = await this.userRepository.findOne(userQuery);
    const formerProfileId: number = user.profileId;
    user.profile = profile;
    user.profileCreated = true;
    await this.userRepository.save(user);
    if ( formerProfileId ) {
      await this.deleteFormerProfileIfExists( formerProfileId );
    }
  }

  async deleteFormerProfileIfExists( formerProfileId: number ): Promise<void> {
    const profile: Profile = await this.profileRepository.findOne( formerProfileId );
    if (profile) {
      await this.profileRepository.remove( profile );
    }
  }

  createProfileObject( profileDto: ProfileDto ): Profile {
    const profile: Profile = new Profile();
    profile.bio = profileDto.bio;
    profile.interests = profileDto.interests;
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
    return await this.profileRepository.findOne( user.profileId );
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

  async getProfileImage( username: string ): Promise<any> {
    const profile: Profile = await this.checkIfUserExistsAndReturnRelevantProfile( username );
    if ( profile ) {
      const fileName: string = profile.profilePhoto;
      const params = {
        Bucket: AWS_S3_BUCKET_NAME,
        Key: 'profile-photos/' + fileName,
      };
      s3.getObject( params )
      .promise()
      .then(
        data => {
          return data;
        },
        err => {
          console.log(err);
          return null;
        });
      } else {
        return null;
      }

  }
}