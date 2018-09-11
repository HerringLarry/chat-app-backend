import { Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Piece {
  @PrimaryGeneratedColumn() id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({nullable: true})
  piecePhotoURL: string;
}