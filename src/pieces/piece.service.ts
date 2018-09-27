import { Req, Res, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'users/user.entity';
import * as AWS from 'aws-sdk';
import { extname } from 'path';
import { Piece } from './piece.entity';
import { PieceQuery, UserQuery, PieceIdQuery } from './structures/helpers';
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

@Injectable()
export class PieceService {
  constructor( @InjectRepository(Piece) private readonly pieceRepository: Repository<Piece>,
               @InjectRepository(User) private readonly userRepository: Repository<User>  ) {}

  async createPiece( pieceDto: PieceDto, username: string ): Promise<void> {
    let piece: Piece = this.createPieceObject( pieceDto );
    piece = await this.pieceRepository.save( piece );
    if ( piece ) {
      this.updateUsersPieces( piece, username );
    }
  }

  createPieceObject( pieceDto: PieceDto ): Piece {
    const piece: Piece = new Piece();
    piece.name = pieceDto.name;
    piece.description = pieceDto.description;
    return piece;
  }

  async updateUsersPieces( piece: Piece, username: string ): Promise<void> {
    const userQuery: UserQuery = new UserQuery( username );
    const user: User = await this.userRepository.findOne( userQuery );
    if ( user ) {
      user.pieces.push( piece );
    }
  }

  async createReference( fileName: string, pieceName: string ): Promise<boolean> {
    const pieceQuery: PieceQuery = new PieceQuery( pieceName );
    const piece: Piece = await this.pieceRepository.findOne( pieceQuery );
    if ( piece ) {
      piece.piecePhotoURL = fileName;
      return true;
    } else {
      return false;
    }
  }

  async getAllPieces( username: string ): Promise<Piece[]> {
    const userQuery: UserQuery = new UserQuery( username );
    const user: User = await this.userRepository.findOne( userQuery );
    const pieces: Piece[] = [];
    for ( const pieceId of user.pieceIds ){
      const pieceQuery: PieceIdQuery = new PieceIdQuery( pieceId );
      const piece: Piece = await this.pieceRepository.findOne( pieceQuery );
      pieces.push( piece );
    }

    return pieces;
  }

  async uploadPieceImage( @Req() req, pieceName: string ): Promise<void> {
    const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
    const fileName = `${randomName}${extname(req.file.originalname)}`;
    const params = {
      Body: req.file.buffer,
      Bucket: AWS_S3_BUCKET_NAME,
      Key: 'piece-photos/' + fileName,
    };
    const shouldUploadFile = await this.createReference( fileName, pieceName );
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
