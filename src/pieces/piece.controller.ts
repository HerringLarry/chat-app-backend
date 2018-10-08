import { Controller, Get, Body, Post, UseInterceptors, UploadedFiles, FilesInterceptor, Res, Req, FileInterceptor, Param } from '@nestjs/common';
import { PieceService } from './piece.service';
import * as AWS from 'aws-sdk';
import { extname } from 'path';
import { Piece } from './piece.entity';
import { PieceDto } from './dto/piece.dto';

const AWS_S3_BUCKET_NAME = 'artapps3';
const accessKey = process.env.accessKeyId;
const secretAccessKey = process.env.secretAccessKey;
const config = {
  accessKeyId: accessKey,
  secretAccessKey: secretAccessKey,
};
AWS.config.update(config);
const s3 = new AWS.S3();

@Controller('piece')
export class PieceController {

    constructor( private _pieceService: PieceService ) {}

      @Post('/artPhotos/:username/:piecename')
      @UseInterceptors(FileInterceptor('file'))
      async uploadArtPhoto(@Req() req, @Param('username') username, @Param('piecename') pieceName): Promise<void> {
          return await this._pieceService.uploadPieceImage(req, pieceName, username);
      }

      @Get('/:username')
      async getAllPieces(@Param('username') username: string): Promise<Piece[]> {
          return await this._pieceService.getAllPieces( username );
      }

      @Post('/create/:username')
      async createPiece(@Param('username') username, @Body() pieceDto: PieceDto): Promise<any> {
          return await this._pieceService.createPiece(pieceDto, username);
      }

      @Get('/photo/:photoPath')
      async getArtPhoto(@Param('photoPath') photoPath: string, @Res() res): Promise<any>{
        if ( photoPath ) {
          const fileName: string = photoPath;
          const params = {
            Bucket: AWS_S3_BUCKET_NAME,
            Key: 'art-photos/' + fileName,
          };
          s3.getObject(params).createReadStream().pipe(res);
        }
      }
}