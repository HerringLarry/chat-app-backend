import { Controller, Get, Body, Post, UseInterceptors, UploadedFiles, FilesInterceptor, Res, Req, FileInterceptor, Param } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileDto } from './dto/profile.dto';
import * as AWS from 'aws-sdk';
import { extname } from 'path';
import { Profile } from './profile.entity';

const AWS_S3_BUCKET_NAME = 'artapps3';
const accessKey = process.env.accessKeyId;
const secretAccessKey = process.env.secretAccessKey;
const config = {
  accessKeyId: accessKey,
  secretAccessKey: secretAccessKey,
};
AWS.config.update(config);
const s3 = new AWS.S3();

@Controller('profile')
export class ProfileController {

    constructor( private _profileService: ProfileService ) {}

    @Post('/info')
    async createProfile(@Body() profileDto: ProfileDto): Promise<void> {
        this._profileService.createProfile( profileDto );
    }

    @Post('/profilePhoto/:username')
    @UseInterceptors(FileInterceptor('file'))
    async uploadProfilePhoto(@Req() req, @Param('username') username): Promise<void> {
        await this._profileService.uploadProfileImage( req , username);

    }

    @Get('/:username')
    async getProfile(@Param('username') username): Promise<Profile> {
        return await this._profileService.checkIfUserExistsAndReturnRelevantProfile( username );
    }

    @Get('/profileImage/:profileImagePath')
    async getProfileImage(@Param('profileImagePath') profileImagePath: string, @Res() res): Promise<any> {
        console.log('in');
        const fileName: string = profileImagePath;
        const params = {
          Bucket: AWS_S3_BUCKET_NAME,
          Key: 'profile-photos/' + fileName,
        };

        s3.getObject(params).createReadStream().pipe(res);
    }
}