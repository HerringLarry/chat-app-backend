import { Controller, Get, Body, Post, UseInterceptors, UploadedFiles, FilesInterceptor, Res, Req, FileInterceptor, Param } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileDto } from './dto/profile.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';

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

    // @Post('/artPhotos/:username')
    // @UseInterceptors(FileInterceptor('file'))
    // async uploadArtPhoto(@Req() req, @Param('username') username): Promise<void> {
    //     await this._profileService.uploadArtPhoto( req, username );
    // }
}