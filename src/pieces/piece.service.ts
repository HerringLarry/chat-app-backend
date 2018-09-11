import { Req, Res, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'users/user.entity';
import * as multer from 'multer';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';
import { extname } from 'path';

const AWS_S3_BUCKET_NAME = 'artapps3bucket';
AWS.config.loadFromPath('./aws/AwsConfig.json');
const s3 = new AWS.S3();

@Injectable()
export class PieceService {
  /*constructor( @InjectRepository(Profile) private readonly profileRepository: Repository<Profile>,
               @InjectRepository(User) private readonly userRepository: Repository<User>  ) {}

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
  }*/
}