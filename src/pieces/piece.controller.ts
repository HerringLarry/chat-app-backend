import { Controller, Get, Body, Post, UseInterceptors, UploadedFiles, FilesInterceptor, Res, Req, FileInterceptor, Param } from '@nestjs/common';
import { PieceService } from './piece.service';
import * as AWS from 'aws-sdk';
import { extname } from 'path';

const AWS_S3_BUCKET_NAME = 'artapps3bucket';
AWS.config.loadFromPath('./aws/AwsConfig.json');
const s3 = new AWS.S3();

@Controller('piece')
export class PieceController {

    constructor( private _pieceService: PieceService ) {}

      @Post('/artPhotos/:username')
      @UseInterceptors(FileInterceptor('file'))
      async uploadArtPhoto(@Req() req, @Param('username') username): Promise<void> {
          //const pieceUrl = await this._pieceService.uploadArtPhoto( req, username );
          //await this._pieceService.createPiece();
      }

      @Get('/:photoPath')
      async getArtPhoto(@Param('photoPath') photoPath: string, @Res() res): Promise<any>{
        const fileName: string = photoPath;
        const params = {
          Bucket: AWS_S3_BUCKET_NAME,
          Key: 'piece-photos/' + fileName,
        };

        s3.getObject(params).createReadStream().pipe(res);
      }
}