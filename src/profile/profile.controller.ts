import { Controller, Get, Body, Post, UseInterceptors, UploadedFiles, FilesInterceptor, Res, Req, FileInterceptor } from '@nestjs/common';
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

    @Post('/profilePhoto')
    @UseInterceptors(FilesInterceptor('files'))
    async uploadProfilePhoto(@UploadedFiles() file): Promise<void> {
        // tslint:disable-next-line:no-console
        console.log(file);
    }

    @Post('/artPhotos')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
          destination: './uploads'
          , filename: async (req, file, cb) => {
            const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
            const fileName = `${randomName}${extname(file.originalname)}`;
            await this.profileService.createReference(fileName, req);
            cb(null, fileName);
          },
        }),
      }))
    async uploadArtPhotos(@Req() req, @Res() res): Promise<void> {
    }
}