import { Entity, Column, PrimaryGeneratedColumn, ManyToOne} from 'typeorm';
import { Profile } from 'profile/profile.entity';
import { User } from 'users/user.entity';

@Entity()
export class Piece {
  @PrimaryGeneratedColumn() id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({nullable: true})
  piecePhotoURL: string;

  @ManyToOne( type => User, user => user.id )
  user: User;
}