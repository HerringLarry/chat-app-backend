import { Module } from '@nestjs/common';
import { PieceService } from './piece.service';
import { PieceController } from './piece.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Piece } from './piece.entity';
import { User } from 'users/user.entity';

@Module({
    imports: [ TypeOrmModule.forFeature([Piece]), TypeOrmModule.forFeature([User]),
    ],
    controllers: [
        PieceController,
    ],
    providers: [
        PieceService,
    ],
    exports: [
        PieceService,
    ],
})
export class PieceModule {}