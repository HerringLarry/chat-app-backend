import { Controller, Get, Post, Body, Param, Put, UseGuards, Headers, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UseInterceptors, FileInterceptor, UploadedFile } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UsersService } from 'users/users.service';

@Controller('profilephoto')
export class ProfilePhotoController {

    constructor( private _userService: UsersService ) {}

    @Post('/:userId')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
          destination: './uploads'
          , filename: (req, file, cb) => {
            // Generating a 32 random chars long string
            const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
            // Calling the callback passing the random name generated with the original extension name
            cb(null, `${randomName}${extname(file.originalname)}`);
          },
        }),
      }))
      async upload( @UploadedFile() file, @Param('userId') userId: number, @Res() res: any) {
        return await this._userService.addProfilePhotoPath( userId, file.filename);
    }

    @Get('/pic/:photoPath')
    async getPhoto( @Param('photoPath') photoPath: string, @Res() res: any ) {
        return res.sendFile(photoPath, { root: 'uploads' });
    }

}