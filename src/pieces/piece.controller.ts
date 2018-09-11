import { Controller, Get, Body, Post, UseInterceptors, UploadedFiles, FilesInterceptor, Res, Req, FileInterceptor, Param } from '@nestjs/common';
import { PieceService } from './piece.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('piece')
export class PieceController {

    constructor( private _pieceService: PieceService ) {}

    // @Post('/artPhotos/:username')
    // @UseInterceptors(FileInterceptor('file'))
    // async uploadArtPhoto(@Req() req, @Param('username') username): Promise<void> {
    //     await this._profileService.uploadArtPhoto( req, username );
    // }
}